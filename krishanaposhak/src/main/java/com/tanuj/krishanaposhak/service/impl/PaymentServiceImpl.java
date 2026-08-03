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
    private final com.tanuj.krishanaposhak.service.RefundService refundService;
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

        // Save payment ID and signature
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);

        // Fulfill order idempotently (handles both normal flow and webhook-before-verify race condition)
        com.tanuj.krishanaposhak.enums.FulfillmentResult result = fulfillOrder(order, payment);

        if (result == com.tanuj.krishanaposhak.enums.FulfillmentResult.STOCK_EXHAUSTED_REFUNDED) {
            PaymentResponse response = paymentMapper.toResponse(payment);
            response.setPaymentStatus(payment.getPaymentStatus());
            response.setRefunded(true);
            response.setRefundInitiated(true);
            response.setRefundStatus(payment.getPaymentStatus() == PaymentStatus.REFUNDED ? "PROCESSED" : "PENDING");
            response.setMessage("Your payment was successful, however the item became unavailable. A full refund has been initiated.");
            return response;
        }

        return paymentMapper.toResponse(payment);
    }

    /**
     * Idempotently fulfills an order (stock reduction, coupon usage, cart clearing, email notification).
     * Uses pessimistic write lock on Order DB row to ensure atomic check-and-update across concurrent threads.
     * If stock is depleted post-payment, automatically initiates a full Razorpay refund and sets order status
     * to FAILED_INSUFFICIENT_STOCK.
     *
     * @return FulfillmentResult indicating SUCCESS, SKIPPED_ALREADY_FULFILLED, or STOCK_EXHAUSTED_REFUNDED
     */
    private com.tanuj.krishanaposhak.enums.FulfillmentResult fulfillOrder(Order order, Payment payment) {
        // Fetch order with PESSIMISTIC_WRITE lock to prevent concurrent check-then-act race conditions
        Order lockedOrder = orderRepository.findByIdWithLock(order.getId())
                .orElse(order);

        // Idempotency Check: If order is already CONFIRMED or FAILED_INSUFFICIENT_STOCK, skip fulfillment/refund
        if (lockedOrder.getOrderStatus() == OrderStatus.CONFIRMED ||
            lockedOrder.getOrderStatus() == OrderStatus.FAILED_INSUFFICIENT_STOCK) {
            log.info("Fulfillment skipped: Order {} is already in status {}.",
                    lockedOrder.getOrderNumber(), lockedOrder.getOrderStatus());
            return com.tanuj.krishanaposhak.enums.FulfillmentResult.SKIPPED_ALREADY_FULFILLED;
        }

        // 1. Stock Availability Pre-check using PESSIMISTIC_WRITE lock on ProductVariant rows
        boolean stockInsufficient = false;
        String insufficientProduct = "";

        for (OrderItem item : lockedOrder.getOrderItems()) {
            if (item.getProductVariant() != null) {
                ProductVariant variant = productVariantRepository.findByIdWithLock(item.getProductVariant().getId())
                        .orElse(item.getProductVariant());
                if (variant.getStock() < item.getQuantity()) {
                    stockInsufficient = true;
                    insufficientProduct = variant.getProduct() != null ? variant.getProduct().getName() : "Product ID " + variant.getId();
                    break;
                }
            }
        }

        // 2. Handle Post-Payment Stock Exhaustion: Trigger automatic refund & persist failure status
        if (stockInsufficient) {
            log.warn("Post-payment stock exhaustion detected for Order {}. Product: {}",
                    lockedOrder.getOrderNumber(), insufficientProduct);

            // Update order and payment status to failure / refund pending on locked entity
            payment.setPaymentStatus(PaymentStatus.REFUND_PENDING);
            paymentRepository.save(payment);

            lockedOrder.setOrderStatus(OrderStatus.FAILED_INSUFFICIENT_STOCK);
            lockedOrder.setPaymentStatus(PaymentStatus.REFUND_PENDING);
            orderRepository.save(lockedOrder);

            // Trigger automatic Razorpay refund in REQUIRES_NEW transaction T2 (only touches refunds table)
            try {
                refundService.processAutomaticRefund(
                        lockedOrder,
                        "Automatic refund: stock unavailable for " + insufficientProduct + " after payment capture"
                );
                // Refund API succeeded — update status to REFUNDED on T1's locked entities
                payment.setPaymentStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(payment);

                lockedOrder.setPaymentStatus(PaymentStatus.REFUNDED);
                orderRepository.save(lockedOrder);
            } catch (Exception e) {
                // Refund API failed — leave status as REFUND_PENDING for manual retry
                log.error("Automatic refund trigger error for Order {}: {}", lockedOrder.getOrderNumber(), e.getMessage());
            }

            return com.tanuj.krishanaposhak.enums.FulfillmentResult.STOCK_EXHAUSTED_REFUNDED;
        }

        // 3. Normal Fulfillment Flow (Payment = PAID, Order = CONFIRMED)
        payment.setPaymentStatus(PaymentStatus.PAID);
        if (payment.getPaidAt() == null) {
            payment.setPaidAt(Instant.now());
        }
        paymentRepository.save(payment);

        lockedOrder.setPaymentStatus(PaymentStatus.PAID);
        lockedOrder.setOrderStatus(OrderStatus.CONFIRMED);
        orderRepository.save(lockedOrder);

        // Reduce stock for products in the order using locked ProductVariant entities
        for (OrderItem item : lockedOrder.getOrderItems()) {
            if (item.getProductVariant() != null) {
                ProductVariant variant = productVariantRepository.findByIdWithLock(item.getProductVariant().getId())
                        .orElse(item.getProductVariant());
                variant.setStock(variant.getStock() - item.getQuantity());
                productVariantRepository.save(variant);
            }
        }

        // Record coupon usage if order used a coupon
        if (lockedOrder.getCouponCode() != null && !lockedOrder.getCouponCode().isBlank()) {
            couponRepository.findByCode(lockedOrder.getCouponCode()).ifPresent(coupon -> {
                if (!couponUsageRepository.existsByOrderId(lockedOrder.getId())) {
                    int currentCount = coupon.getUsedCount() != null ? coupon.getUsedCount() : 0;
                    coupon.setUsedCount(currentCount + 1);
                    couponRepository.save(coupon);

                    couponUsageRepository.save(
                            CouponUsage.builder()
                                    .coupon(coupon)
                                    .user(lockedOrder.getUser())
                                    .order(lockedOrder)
                                    .build()
                    );
                }
            });
        }

        // Clear user's cart
        cartRepository.findByUserId(lockedOrder.getUser().getId())
                .ifPresent(cart -> cartItemRepository.deleteByCartId(cart.getId()));

        // Send order confirmation email asynchronously
        try {
            Map<String, Object> model = new HashMap<>();
            model.put("order", lockedOrder);
            model.put("orderItems", lockedOrder.getOrderItems());
            model.put("customerName", lockedOrder.getCustomerName());
            model.put("orderNumber", lockedOrder.getOrderNumber());
            model.put("orderDate", lockedOrder.getCreatedAt());
            model.put("totalAmount", lockedOrder.getTotalAmount());
            emailService.sendTemplateEmail(lockedOrder.getCustomerEmail(),
                    "Order Confirmation - " + lockedOrder.getOrderNumber(),
                    "order-confirmation",
                    model);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order {}", lockedOrder.getOrderNumber(), e);
        }

        return com.tanuj.krishanaposhak.enums.FulfillmentResult.SUCCESS;
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
    @Transactional
    public void processWebhookEvent(String eventId, String eventType, String payload) {
        // Idempotency Check: Check if this webhook event has already been successfully processed
        RazorpayWebhookEvent existingEvent = webhookEventRepository.findByEventId(eventId);
        if (existingEvent != null && existingEvent.getProcessedAt() != null) {
            log.info("Duplicate processed Razorpay webhook event received: {}", eventId);
            return;
        }

        try {
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
                    handleRefundProcessed(json);
                    break;
                default:
                    log.warn("Received unsupported Razorpay webhook event type: {}", eventType);
                    break;
            }

            // Save/update the webhook event ONLY after handler executes successfully
            if (existingEvent == null) {
                existingEvent = RazorpayWebhookEvent.builder()
                        .eventId(eventId)
                        .eventType(eventType)
                        .build();
            }
            existingEvent.setProcessedAt(Instant.now());
            webhookEventRepository.save(existingEvent);

            log.info("Successfully processed Razorpay webhook event: {} of type {}", eventId, eventType);

        } catch (Exception e) {
            log.error("Failed to process Razorpay webhook event: {} of type {}", eventId, eventType, e);
            // Re-throw exception so Controller returns HTTP 500 to Razorpay for automatic retries
            throw new RuntimeException("Failed to process Razorpay webhook event: " + eventId, e);
        }
    }

    private void handlePaymentCaptured(JSONObject json) {
        String razorpayPaymentId = null;
        String razorpayOrderId = null;
        Integer capturedAmount = null;

        // Extract fields from standard Razorpay webhook payload structure: payload.payment.entity
        if (json.has("payload") && json.optJSONObject("payload") != null) {
            JSONObject payloadObj = json.getJSONObject("payload");
            if (payloadObj.has("payment") && payloadObj.optJSONObject("payment") != null) {
                JSONObject paymentObj = payloadObj.getJSONObject("payment");
                if (paymentObj.has("entity") && paymentObj.optJSONObject("entity") != null) {
                    JSONObject entity = paymentObj.getJSONObject("entity");
                    razorpayPaymentId = entity.optString("id", null);
                    razorpayOrderId = entity.optString("order_id", null);
                    if (entity.has("amount")) {
                        capturedAmount = entity.optInt("amount");
                    }
                }
            }
        }

        // Fallback for flat JSON formats or mock payloads
        if (razorpayPaymentId == null) {
            razorpayPaymentId = json.optString("razorpay_payment_id", json.optString("id", null));
        }
        if (razorpayOrderId == null) {
            razorpayOrderId = json.optString("razorpay_order_id", json.optString("order_id", null));
        }
        if (capturedAmount == null && json.has("amount")) {
            capturedAmount = json.optInt("amount");
        }

        if (razorpayPaymentId == null || razorpayOrderId == null) {
            throw new IllegalArgumentException("Missing required fields (payment_id/order_id) in payment.captured event");
        }

        final String targetOrderId = razorpayOrderId;
        Payment payment = paymentRepository.findByRazorpayOrderId(targetOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for Razorpay order: " + targetOrderId));

        Order order = payment.getOrder();
        if (order == null) {
            throw new IllegalArgumentException("Order not found for Payment ID: " + payment.getId());
        }

        // Verify captured amount matches expected order total amount (in paise)
        if (capturedAmount != null) {
            int expectedAmountInPaise = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue();
            if (capturedAmount != expectedAmountInPaise) {
                log.error("Payment amount mismatch in webhook for Order {}: expected {} paise, received {} paise",
                        order.getOrderNumber(), expectedAmountInPaise, capturedAmount);
                throw new IllegalArgumentException("Captured amount mismatch for Razorpay order: " + razorpayOrderId);
            }
        }

        // Set payment ID on payment entity
        payment.setRazorpayPaymentId(razorpayPaymentId);

        // Delegate fulfillment to shared, pessimistic-locked, idempotent method
        com.tanuj.krishanaposhak.enums.FulfillmentResult result = fulfillOrder(order, payment);
        log.info("Webhook handlePaymentCaptured completed with result: {} for Order {}", result, order.getOrderNumber());
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

    private void handleRefundProcessed(JSONObject json) {
        String razorpayPaymentId = json.optString("razorpay_payment_id", null);
        String razorpayRefundId = json.optString("id", null);

        if (razorpayPaymentId == null) {
            log.warn("Missing razorpay_payment_id in refund.processed event");
            return;
        }

        paymentRepository.findByRazorpayPaymentId(razorpayPaymentId).ifPresent(payment -> {
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            if (order != null) {
                order.setPaymentStatus(PaymentStatus.REFUNDED);
                orderRepository.save(order);
            }

            if (razorpayRefundId != null) {
                Refund refund = refundRepository.findByRazorpayRefundId(razorpayRefundId);
                if (refund != null) {
                    refund.setStatus(RefundStatus.PROCESSED);
                    refundRepository.save(refund);
                }
            }
            log.info("Successfully processed refund.processed webhook event for Payment ID: {}", razorpayPaymentId);
        });
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

    @org.springframework.beans.factory.annotation.Value("${payment.reconciliation.threshold-minutes:10}")
    private int reconciliationThresholdMinutes;

    @org.springframework.beans.factory.annotation.Value("${payment.cleanup.timeout-minutes:30}")
    private int cleanupTimeoutMinutes;

    @Override
    @Transactional
    public int reconcilePendingPayments() {
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusMinutes(reconciliationThresholdMinutes);
        java.util.List<Payment> pendingPayments = paymentRepository.findByPaymentStatus(PaymentStatus.PENDING);
        if (pendingPayments.isEmpty()) {
            return 0;
        }

        int recoveredCount = 0;
        for (Payment payment : pendingPayments) {
            if (payment.getCreatedAt() != null && payment.getCreatedAt().isAfter(threshold)) {
                continue; // Skip recent payments still within normal window
            }

            if (payment.getRazorpayOrderId() == null || payment.getRazorpayOrderId().isBlank()) {
                continue;
            }

            Order order = payment.getOrder();
            if (order == null || order.getOrderStatus() == OrderStatus.CONFIRMED) {
                continue;
            }

            try {
                java.util.List<com.razorpay.Payment> rzpPayments = razorpayService.fetchPaymentsForOrder(payment.getRazorpayOrderId());
                com.razorpay.Payment capturedPayment = null;
                for (com.razorpay.Payment rzpPmt : rzpPayments) {
                    String pmtStatus = rzpPmt.get("status");
                    if ("captured".equalsIgnoreCase(pmtStatus)) {
                        capturedPayment = rzpPmt;
                        break;
                    }
                }

                if (capturedPayment != null) {
                    String capturedId = capturedPayment.get("id");
                    payment.setRazorpayPaymentId(capturedId);
                    com.tanuj.krishanaposhak.enums.FulfillmentResult result = fulfillOrder(order, payment);
                    if (result == com.tanuj.krishanaposhak.enums.FulfillmentResult.SUCCESS ||
                        result == com.tanuj.krishanaposhak.enums.FulfillmentResult.STOCK_EXHAUSTED_REFUNDED) {
                        recoveredCount++;
                        log.info("[AUDIT] Payment Recovered via Reconciliation -> Order Number: {}, Razorpay Order ID: {}, Captured Payment ID: {}, Result: {}",
                                order.getOrderNumber(), payment.getRazorpayOrderId(), capturedId, result);
                    }
                }
            } catch (Exception e) {
                log.error("[AUDIT] Payment Reconciliation Error -> Order Number: {}, Razorpay Order ID: {}, Error: {}",
                        order.getOrderNumber(), payment.getRazorpayOrderId(), e.getMessage());
            }
        }

        return recoveredCount;
    }

    @Override
    @Transactional
    public com.tanuj.krishanaposhak.dto.payment.PaymentRecoveryResponse reconcilePendingPaymentsForUser(Long userId) {
        java.util.List<Order> userOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        java.util.List<PaymentResponse> recoveredList = new java.util.ArrayList<>();
        java.util.List<PaymentResponse> pendingList = new java.util.ArrayList<>();

        int recoveredCount = 0;
        int pendingCount = 0;
        int failedCount = 0;
        int refundPendingCount = 0;

        for (Order order : userOrders) {
            Payment payment = order.getPayment();
            if (payment == null) continue;

            if (payment.getPaymentStatus() == PaymentStatus.PENDING && payment.getRazorpayOrderId() != null) {
                try {
                    java.util.List<com.razorpay.Payment> rzpPayments = razorpayService.fetchPaymentsForOrder(payment.getRazorpayOrderId());
                    com.razorpay.Payment capturedPayment = null;
                    for (com.razorpay.Payment rzpPmt : rzpPayments) {
                        if ("captured".equalsIgnoreCase((String) rzpPmt.get("status"))) {
                            capturedPayment = rzpPmt;
                            break;
                        }
                    }

                    if (capturedPayment != null) {
                        payment.setRazorpayPaymentId(capturedPayment.get("id"));
                        fulfillOrder(order, payment);
                        recoveredCount++;
                        recoveredList.add(paymentMapper.toResponse(payment));
                        log.info("[AUDIT] Login Recovery -> Order Number: {} recovered for User ID {}", order.getOrderNumber(), userId);
                        continue;
                    }
                } catch (Exception e) {
                    log.error("[AUDIT] Login Recovery Error -> Order Number: {}, Error: {}", order.getOrderNumber(), e.getMessage());
                }
            }

            if (payment.getPaymentStatus() == PaymentStatus.PENDING) {
                pendingCount++;
                pendingList.add(paymentMapper.toResponse(payment));
            } else if (payment.getPaymentStatus() == PaymentStatus.FAILED) {
                failedCount++;
            } else if (payment.getPaymentStatus() == PaymentStatus.REFUND_PENDING) {
                refundPendingCount++;
            }
        }

        return com.tanuj.krishanaposhak.dto.payment.PaymentRecoveryResponse.builder()
                .recoveredCount(recoveredCount)
                .pendingCount(pendingCount)
                .failedCount(failedCount)
                .refundPendingCount(refundPendingCount)
                .recoveredPayments(recoveredList)
                .pendingPayments(pendingList)
                .message(recoveredCount > 0 ? recoveredCount + " pending payment(s) successfully recovered!" : "Payment status up to date.")
                .build();
    }

    @Override
    @Transactional
    public int cleanupUnpaidPendingOrders() {
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusMinutes(cleanupTimeoutMinutes);
        java.util.List<Order> pendingOrders = orderRepository.findByOrderStatusOrderByCreatedAtDesc(OrderStatus.PENDING);

        if (pendingOrders.isEmpty()) {
            return 0;
        }

        int cancelledCount = 0;
        for (Order order : pendingOrders) {
            if (order.getCreatedAt() != null && order.getCreatedAt().isAfter(threshold)) {
                continue; // Not expired yet
            }

            Payment payment = order.getPayment();
            if (payment != null && payment.getPaymentStatus() == PaymentStatus.PAID) {
                continue; // Payment captured, do not cancel
            }

            // Double check Razorpay API before cancelling
            boolean possessesCapturedPayment = false;
            if (payment != null && payment.getRazorpayOrderId() != null) {
                try {
                    java.util.List<com.razorpay.Payment> rzpPayments = razorpayService.fetchPaymentsForOrder(payment.getRazorpayOrderId());
                    for (com.razorpay.Payment rzpPmt : rzpPayments) {
                        if ("captured".equalsIgnoreCase((String) rzpPmt.get("status"))) {
                            possessesCapturedPayment = true;
                            payment.setRazorpayPaymentId(rzpPmt.get("id"));
                            fulfillOrder(order, payment);
                            log.info("[AUDIT] Pending Order Cleanup prevented -> Order {} was captured in Razorpay. Auto-fulfilled.", order.getOrderNumber());
                            break;
                        }
                    }
                } catch (Exception e) {
                    log.warn("Razorpay check failed during cleanup for Order {}: {}", order.getOrderNumber(), e.getMessage());
                }
            }

            if (!possessesCapturedPayment) {
                order.setOrderStatus(OrderStatus.CANCELLED);
                order.setPaymentStatus(PaymentStatus.FAILED);
                if (payment != null) {
                    payment.setPaymentStatus(PaymentStatus.FAILED);
                    paymentRepository.save(payment);
                }
                orderRepository.save(order);
                cancelledCount++;
                log.info("[AUDIT] Pending Order Cleanup -> Order Number: {} cancelled due to unpaid timeout ({} mins)",
                        order.getOrderNumber(), cleanupTimeoutMinutes);
            }
        }

        return cancelledCount;
    }

    @Override
    @Transactional(readOnly = true)
    public com.tanuj.krishanaposhak.dto.payment.AdminPaymentMonitoringResponse getAdminPaymentMonitoringData(
            String statusFilter, String search, int page, int size) {

        java.util.List<Payment> allPayments = paymentRepository.findAll();

        long totalPayments = allPayments.size();
        long pendingPayments = allPayments.stream().filter(p -> p.getPaymentStatus() == PaymentStatus.PENDING).count();
        long capturedPayments = allPayments.stream().filter(p -> p.getPaymentStatus() == PaymentStatus.PAID).count();
        long awaitingVerification = pendingPayments;
        long awaitingWebhook = pendingPayments;
        long webhookFailed = allPayments.stream().filter(p -> p.getPaymentStatus() == PaymentStatus.FAILED).count();
        long refundPending = allPayments.stream().filter(p -> p.getPaymentStatus() == PaymentStatus.REFUND_PENDING).count();
        long refundFailed = refundRepository.findByStatus(RefundStatus.FAILED).size();
        long recoveredPayments = allPayments.stream().filter(p -> p.getPaymentStatus() == PaymentStatus.PAID && p.getRemarks() != null && p.getRemarks().contains("Reconciled")).count();

        java.util.List<Payment> filtered = allPayments.stream().filter(p -> {
            if (statusFilter != null && !statusFilter.isBlank() && !"ALL".equalsIgnoreCase(statusFilter)) {
                if ("PENDING".equalsIgnoreCase(statusFilter) && p.getPaymentStatus() != PaymentStatus.PENDING) return false;
                if ("PAID".equalsIgnoreCase(statusFilter) && p.getPaymentStatus() != PaymentStatus.PAID) return false;
                if ("FAILED".equalsIgnoreCase(statusFilter) && p.getPaymentStatus() != PaymentStatus.FAILED) return false;
                if ("REFUND_PENDING".equalsIgnoreCase(statusFilter) && p.getPaymentStatus() != PaymentStatus.REFUND_PENDING) return false;
                if ("REFUNDED".equalsIgnoreCase(statusFilter) && p.getPaymentStatus() != PaymentStatus.REFUNDED) return false;
            }

            if (search != null && !search.isBlank()) {
                String q = search.toLowerCase();
                boolean matchOrder = p.getOrder() != null && p.getOrder().getOrderNumber().toLowerCase().contains(q);
                boolean matchRzpOrder = p.getRazorpayOrderId() != null && p.getRazorpayOrderId().toLowerCase().contains(q);
                boolean matchRzpPmt = p.getRazorpayPaymentId() != null && p.getRazorpayPaymentId().toLowerCase().contains(q);
                boolean matchCustomer = p.getOrder() != null && (
                        (p.getOrder().getCustomerName() != null && p.getOrder().getCustomerName().toLowerCase().contains(q)) ||
                        (p.getOrder().getCustomerEmail() != null && p.getOrder().getCustomerEmail().toLowerCase().contains(q))
                );
                return matchOrder || matchRzpOrder || matchRzpPmt || matchCustomer;
            }

            return true;
        }).sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).collect(java.util.stream.Collectors.toList());

        int totalElements = filtered.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int start = Math.min(page * size, totalElements);
        int end = Math.min(start + size, totalElements);

        java.util.List<Payment> pageContent = filtered.subList(start, end);

        java.util.List<com.tanuj.krishanaposhak.dto.payment.AdminPaymentMonitoringResponse.PaymentRecordDTO> recordDTOs = new java.util.ArrayList<>();

        for (Payment p : pageContent) {
            Order o = p.getOrder();
            Refund r = refundRepository.findByPaymentId(p.getId());

            recordDTOs.add(com.tanuj.krishanaposhak.dto.payment.AdminPaymentMonitoringResponse.PaymentRecordDTO.builder()
                    .paymentId(p.getId())
                    .orderId(o != null ? o.getId() : null)
                    .orderNumber(o != null ? o.getOrderNumber() : "N/A")
                    .customerName(o != null ? o.getCustomerName() : "N/A")
                    .customerEmail(o != null ? o.getCustomerEmail() : "N/A")
                    .paymentMethod(p.getPaymentMethod() != null ? p.getPaymentMethod().name() : "N/A")
                    .paymentStatus(p.getPaymentStatus() != null ? p.getPaymentStatus().name() : "N/A")
                    .orderStatus(o != null && o.getOrderStatus() != null ? o.getOrderStatus().name() : "N/A")
                    .amount(p.getAmount() != null ? p.getAmount().doubleValue() : 0.0)
                    .razorpayOrderId(p.getRazorpayOrderId())
                    .razorpayPaymentId(p.getRazorpayPaymentId())
                    .refundStatus(r != null && r.getStatus() != null ? r.getStatus().name() : (p.getPaymentStatus() == PaymentStatus.REFUND_PENDING ? "PENDING" : "NONE"))
                    .refundId(r != null ? r.getRazorpayRefundId() : null)
                    .retryCount(r != null ? r.getRetryCount() : 0)
                    .lastRetryAt(r != null ? r.getLastRetryAt() : null)
                    .failureReason(r != null ? r.getFailureReason() : null)
                    .createdAt(p.getCreatedAt())
                    .updatedAt(p.getUpdatedAt())
                    .build());
        }

        return com.tanuj.krishanaposhak.dto.payment.AdminPaymentMonitoringResponse.builder()
                .totalPayments(totalPayments)
                .pendingPayments(pendingPayments)
                .capturedPayments(capturedPayments)
                .awaitingVerification(awaitingVerification)
                .awaitingWebhook(awaitingWebhook)
                .webhookFailed(webhookFailed)
                .refundPending(refundPending)
                .refundFailed(refundFailed)
                .recoveredPayments(recoveredPayments)
                .records(recordDTOs)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();
    }
}