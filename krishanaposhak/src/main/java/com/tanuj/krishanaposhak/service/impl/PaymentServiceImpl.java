package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.payment.*;
import com.tanuj.krishanaposhak.entity.*;
import com.tanuj.krishanaposhak.enums.OrderStatus;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import com.tanuj.krishanaposhak.enums.RefundStatus;
import com.tanuj.krishanaposhak.enums.PaymentMethod;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.exception.ForbiddenException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.PaymentMapper;
import com.tanuj.krishanaposhak.repository.*;
import com.tanuj.krishanaposhak.service.EmailService;
import com.tanuj.krishanaposhak.service.PaymentService;
import com.tanuj.krishanaposhak.service.RazorpayService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;
    private final RazorpayService razorpayService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final EmailService emailService;
    private final RazorpayWebhookEventRepository webhookEventRepository;
    private final RefundRepository refundRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Override
    public RazorpayOrderResponse createRazorpayOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Create Razorpay order request
        CreateRazorpayOrderRequest razorpayRequest = new CreateRazorpayOrderRequest();
        razorpayRequest.setAmount(order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue()); // Convert to paise
        razorpayRequest.setCurrency("INR");
        razorpayRequest.setReceipt(order.getOrderNumber());

        try {
            CreateRazorpayOrderResponse razorpayResponse = razorpayService.createOrder(razorpayRequest);

            // Create a payment record for this Razorpay order
            Payment payment = Payment.builder()
                    .order(order)
                    .paymentMethod(PaymentMethod.RAZORPAY)
                    .paymentStatus(PaymentStatus.PENDING)
                    .amount(order.getTotalAmount())
                    .transactionId("TXN" + UUID.randomUUID().toString().substring(0, 10).toUpperCase()) // Generate a transaction ID
                    .razorpayOrderId(razorpayResponse.getId())
                    .build();

            paymentRepository.save(payment);

            // Return Razorpay order details for the frontend
            return RazorpayOrderResponse.builder()
                    .id(razorpayResponse.getId())
                    .currency(razorpayResponse.getCurrency())
                    .amount(razorpayResponse.getAmount())
                    .key(razorpayResponse.getKey())
                    .build();

        } catch (Exception e) {
            throw new BadRequestException("Unable to create Razorpay order: " + e.getMessage());
        }
    }

    @Override
    public PaymentResponse initiatePayment(Long userId, PaymentRequest request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("This order does not belong to you");
        }

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new BadRequestException("Invalid payment method: " + request.getPaymentMethod());
        }

        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(paymentMethod)
                .paymentStatus(PaymentStatus.PENDING)
                .amount(order.getTotalAmount())
                .transactionId("TXN" + UUID.randomUUID().toString().substring(0, 10).toUpperCase())
                .build();

        payment = paymentRepository.save(payment);

        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse verifyRazorpayPayment(Long userId,
                                                 String razorpayOrderId,
                                                 String razorpayPaymentId,
                                                 String razorpaySignature) {

        // Find the payment by razorpayOrderId
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for Razorpay order: " + razorpayOrderId));

        // Validate that the payment belongs to the user
        Order order = payment.getOrder();
        if (!order.getUser().getId().equals(userId)) {
            throw new ForbiddenException("This payment does not belong to you");
        }

        // Check if the payment is already processed (to prevent duplicate payment)
        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Payment already processed for this order");
        }

        // Verify the signature using Razorpay service
        PaymentVerificationRequest verificationRequest = new PaymentVerificationRequest(
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
        );

        boolean isValid;
        try {
            isValid = razorpayService.verifyPayment(verificationRequest);
        } catch (Exception e) {
            throw new BadRequestException("Unable to verify payment: " + e.getMessage());
        }

        if (!isValid) {
            // Update payment as failed
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(razorpaySignature);
            paymentRepository.save(payment);
            throw new BadRequestException("Payment signature verification failed");
        }

        // Update payment with successful payment details
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaidAt(Instant.now());
        payment = paymentRepository.save(payment);

        // Update the order
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.CONFIRMED); // Assuming CONFIRMED is the status after payment
        orderRepository.save(order);

        // Reduce stock for the products in the order (with validation to prevent negative stock)
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getProductVariant();
            if (variant == null) {
                continue;
            }
            // Validate stock again
            if (variant.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + variant.getProduct().getName());
            }
            // Reduce stock
            variant.setStock(variant.getStock() - item.getQuantity());
            productVariantRepository.save(variant);
        }

        // Record coupon usage if order used a coupon
        if (order.getCouponCode() != null && !order.getCouponCode().isBlank()) {
            couponRepository.findByCode(order.getCouponCode()).ifPresent(coupon -> {
                if (!couponUsageRepository.existsByOrderId(order.getId())) {
                    int currentCount = coupon.getUsedCount() != null ? coupon.getUsedCount() : 0;
                    coupon.setUsedCount(currentCount + 1);
                    couponRepository.save(coupon);

                    couponUsageRepository.save(
                            CouponUsage.builder()
                                    .coupon(coupon)
                                    .user(order.getUser())
                                    .order(order)
                                    .build()
                    );
                }
            });
        }

        // Clear the user's cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
        cartItemRepository.deleteByCartId(cart.getId());

        // Send order confirmation email asynchronously (we'll do it in a try-catch to not break the flow)
        try {
            Map<String, Object> model = new HashMap<>();
            model.put("order", order);
            model.put("orderItems", order.getOrderItems());
            model.put("customerName", order.getCustomerName());
            model.put("orderNumber", order.getOrderNumber());
            model.put("orderDate", order.getCreatedAt());
            model.put("totalAmount", order.getTotalAmount());
            emailService.sendTemplateEmail(order.getCustomerEmail(),
                    "Order Confirmation - " + order.getOrderNumber(),
                    "order-confirmation",
                    model);
        } catch (Exception e) {
            // Log the error but do not fail the payment
            log.error("Failed to send order confirmation email for order {}", order.getOrderNumber(), e);
        }

        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrder(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return paymentMapper.toResponse(payment);
    }

    @Override
    public PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus status) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        payment.setPaymentStatus(status);
        payment = paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setPaymentStatus(status);
        orderRepository.save(order);

        return paymentMapper.toResponse(payment);
    }

    @Override
    public void processWebhookEvent(String eventId, String eventType, String payload) {
        // Check if the event has already been processed (idempotency)
        if (webhookEventRepository.findByEventId(eventId) != null) {
            log.info("Duplicate Razorpay webhook event received: {}", eventId);
            return;
        }

        // Save the event to mark as processed (we'll update processedAt after processing)
        RazorpayWebhookEvent webhookEvent = RazorpayWebhookEvent.builder()
                .eventId(eventId)
                .eventType(eventType)
                .build();
        webhookEventRepository.save(webhookEvent);

        try {
            // Parse the payload to get additional details if needed
            JSONObject json = new JSONObject(payload);

            switch (eventType) {
                case "payment.captured":
                    handlePaymentCaptured(json);
                    break;
                case "payment.failed":
                    handlePaymentFailed(json);
                    break;
                case "order.paid":
                    handleOrderPaid(json);
                    break;
                case "refund.processed":
                    // Refund processing is not implemented in this phase
                    log.info("Received refund.processed event, but refund processing is not implemented in this phase.");
                    break;
                default:
                    log.warn("Received unsupported Razorpay webhook event type: {}", eventType);
                    // Still mark as processed to avoid retries for unknown events
                    break;
            }

            // Mark the event as processed
            webhookEvent.setProcessedAt(Instant.now());
            webhookEventRepository.save(webhookEvent);
            log.info("Successfully processed Razorpay webhook event: {} of type {}", eventId, eventType);
        } catch (Exception e) {
            // If processing fails, we don't update processedAt so it can be retried
            log.error("Failed to process Razorpay webhook event: {} of type {}", eventId, eventType, e);
            // Note: For simplicity in this implementation, we don't implement retry logic for failed events
            // In a production system, you would want a more sophisticated retry mechanism
        }
    }

    private void handlePaymentCaptured(JSONObject json) {
        String razorpayPaymentId = json.optString("razorpay_payment_id", null);
        String razorpayOrderId = json.optString("razorpay_order_id", null);

        if (razorpayPaymentId == null || razorpayOrderId == null) {
            throw new IllegalArgumentException("Missing required fields in payment.captured event");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for Razorpay order: " + razorpayOrderId));

        // Update payment
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaidAt(Instant.now());
        paymentRepository.save(payment);

        // Update order
        Order order = payment.getOrder();
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.CONFIRMED); // Assuming CONFIRMED is the status after payment
        orderRepository.save(order);

        // Note: Stock reduction and cart clearing are handled in the synchronous verification flow (Phase 8.3).
        // For webhook, we only update the payment and order status.
        // The webhook is a fallback in case the synchronous verification fails.
    }

    private void handlePaymentFailed(JSONObject json) {
        String razorpayPaymentId = json.optString("razorpay_payment_id", null);
        String razorpayOrderId = json.optString("razorpay_order_id", null);

        if (razorpayPaymentId == null || razorpayOrderId == null) {
            throw new IllegalArgumentException("Missing required fields in payment.failed event");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for Razorpay order: " + razorpayOrderId));

        // Update payment
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setPaymentStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);

        // Update order if needed (optional, but we can set order payment status to FAILED)
        Order order = payment.getOrder();
        order.setPaymentStatus(PaymentStatus.FAILED);
        // We don't change the order status (it remains as it was, likely PENDING or something else)
        orderRepository.save(order);
    }

    private void handleOrderPaid(JSONObject json) {
        String razorpayPaymentId = json.optString("razorpay_payment_id", null);
        String razorpayOrderId = json.optString("razorpay_order_id", null);

        if (razorpayPaymentId == null || razorpayOrderId == null) {
            throw new IllegalArgumentException("Missing required fields in order.paid event");
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for Razorpay order: " + razorpayOrderId));

        // Prevent duplicate processing: if payment is already paid, skip
        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            log.info("Payment for order {} is already paid. Skipping duplicate order.paid event.", razorpayOrderId);
            return;
        }

        // Update payment
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaidAt(Instant.now());
        paymentRepository.save(payment);

        // Update order
        Order order = payment.getOrder();
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.CONFIRMED); // Assuming CONFIRMED is the status after payment
        orderRepository.save(order);
    }

    @Override
    public RefundResponse createRefund(Long userId, RefundRequest request) {
        // Validate input
        if (request == null) {
            throw new BadRequestException("Refund request cannot be null");
        }

        if (request.getPaymentId() == null) {
            throw new BadRequestException("Payment ID is required");
        }

        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new BadRequestException("Refund amount must be greater than zero");
        }

        // Get the payment
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + request.getPaymentId()));

        // Validate that the payment belongs to the user
        Order order = payment.getOrder();
        if (!order.getUser().getId().equals(userId)) {
            throw new ForbiddenException("This payment does not belong to you");
        }

        // Check payment status - can only refund successful payments
        if (payment.getPaymentStatus() != PaymentStatus.PAID) {
            throw new BadRequestException("Only successful payments can be refunded");
        }

        // Check existing refunds to prevent double refunding
        int paymentAmountInPaise = payment.getAmount().multiply(BigDecimal.valueOf(100)).intValue();
        Integer totalRefundedAmount = refundRepository.getTotalRefundedAmountByPaymentId(payment.getId());
        int totalRefunded = totalRefundedAmount == null ? 0 : totalRefundedAmount;
        if (totalRefunded >= paymentAmountInPaise) {
            throw new BadRequestException("Payment is already fully refunded");
        }

        // Convert amount to paise (multiply by 100)
        int refundAmountInPaise = request.getAmount() * 100;

        // Validate refund amount doesn't exceed remaining amount
        if (refundAmountInPaise > paymentAmountInPaise - totalRefunded) {
            throw new BadRequestException("Refund amount exceeds remaining amount");
        }

        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", refundAmountInPaise);
        if (request.getReason() != null && !request.getReason().isEmpty()) {
            refundRequest.put("notes", new JSONObject(Map.of("reason", request.getReason())));
        }

        try {
            // Create refund via Razorpay API
            com.razorpay.Refund razorpayRefund = razorpayService.createRefund(
                    payment.getRazorpayPaymentId(),
                    refundRequest
            );

            // Save refund record
            Refund refund = Refund.builder()
                    .razorpayRefundId(razorpayRefund.get("id"))
                    .payment(payment)
                    .order(order)
                    .amount(refundAmountInPaise)
                    .reason(request.getReason())
                    .status(RefundStatus.PROCESSED)
                    .createdAt(Instant.now())
                    .build();

            refund = refundRepository.save(refund);

            // Update payment status based on refund amount
            if (refundAmountInPaise >= paymentAmountInPaise) {
                // Full refund
                payment.setPaymentStatus(PaymentStatus.REFUNDED);
                order.setPaymentStatus(PaymentStatus.REFUNDED);
                // Note: In a real e-commerce system, you might want to restore inventory here
                // depending on your business rules (e.g., only for cancel orders)
            } else {
                // Partial refund
                payment.setPaymentStatus(PaymentStatus.PARTIALLY_REFUNDED);
                order.setPaymentStatus(PaymentStatus.PARTIALLY_REFUNDED);
            }

            paymentRepository.save(payment);
            orderRepository.save(order);

            // Send refund notification email
            try {
                Map<String, Object> model = new HashMap<>();
                model.put("order", order);
                model.put("refundAmount", request.getAmount());
                model.put("refundStatus", refund.getStatus());
                model.put("reason", request.getReason());
                emailService.sendTemplateEmail(order.getCustomerEmail(),
                        "Refund Processed - " + order.getOrderNumber(),
                        "refund-confirmation",
                        model);
            } catch (Exception e) {
                // Log email failure but don't fail the refund
                log.error("Failed to send refund confirmation email for order {}", order.getOrderNumber(), e);
            }

            // Return response
            return RefundResponse.builder()
                    .id(refund.getId())
                    .razorpayRefundId(refund.getRazorpayRefundId())
                    .amount(refund.getAmount() / 100) // Convert back to INR
                    .currency("INR")
                    .status(refund.getStatus().toString())
                    .reason(refund.getReason())
                    .paymentId(payment.getId())
                    .orderId(order.getId())
                    .build();

        } catch (com.razorpay.RazorpayException e) {
            // Handle Razorpay API errors
            log.error("Razorpay API error while creating refund: {}", e.getMessage());

            // Create failed refund record for tracking
            Refund failedRefund = Refund.builder()
                    .razorpayRefundId("FAILED_" + System.currentTimeMillis())
                    .payment(payment)
                    .order(order)
                    .amount(refundAmountInPaise)
                    .reason(request.getReason())
                    .status(RefundStatus.FAILED)
                    .createdAt(Instant.now())
                    .build();

            refundRepository.save(failedRefund);

            throw new BadRequestException("Refund failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while processing refund: {}", e.getMessage());
            throw new BadRequestException("Failed to process refund: " + e.getMessage());
        }
    }

    @Override
    public RefundResponse getRefundById(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("Refund not found with id: " + refundId));

        return RefundResponse.builder()
                .id(refund.getId())
                .razorpayRefundId(refund.getRazorpayRefundId())
                .amount(refund.getAmount() / 100) // Convert back to INR
                .currency("INR")
                .status(refund.getStatus().toString())
                .reason(refund.getReason())
                .paymentId(refund.getPayment().getId())
                .orderId(refund.getOrder().getId())
                .build();
    }

    @Override
    public RefundResponse getRefundByPaymentId(Long paymentId) {
        Refund refund = refundRepository.findByPaymentId(paymentId);
        if (refund == null) {
            throw new ResourceNotFoundException("No refund found for payment ID: " + paymentId);
        }

        return RefundResponse.builder()
                .id(refund.getId())
                .razorpayRefundId(refund.getRazorpayRefundId())
                .amount(refund.getAmount() / 100) // Convert back to INR
                .currency("INR")
                .status(refund.getStatus().toString())
                .reason(refund.getReason())
                .paymentId(refund.getPayment().getId())
                .orderId(refund.getOrder().getId())
                .build();
    }
}