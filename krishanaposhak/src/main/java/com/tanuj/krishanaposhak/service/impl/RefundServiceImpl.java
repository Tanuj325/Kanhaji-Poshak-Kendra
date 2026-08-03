package com.tanuj.krishanaposhak.service.impl;

import com.razorpay.RazorpayException;

import com.tanuj.krishanaposhak.dto.payment.RefundResponse;
import com.tanuj.krishanaposhak.entity.Order;
import com.tanuj.krishanaposhak.entity.Payment;
import com.tanuj.krishanaposhak.entity.Refund;
import com.tanuj.krishanaposhak.enums.PaymentMethod;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import com.tanuj.krishanaposhak.enums.RefundStatus;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.repository.OrderRepository;
import com.tanuj.krishanaposhak.repository.PaymentRepository;
import com.tanuj.krishanaposhak.repository.RefundRepository;
import com.tanuj.krishanaposhak.service.EmailService;
import com.tanuj.krishanaposhak.service.RazorpayService;
import com.tanuj.krishanaposhak.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final RefundRepository refundRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final RazorpayService razorpayService;
    private final EmailService emailService;


    @Override
    @Transactional(readOnly = true)
    public boolean isEligibleForRefund(Order order) {
        if (order == null || order.getPayment() == null) {
            return false;
        }

        Payment payment = order.getPayment();

        // 1. Payment Method = RAZORPAY
        if (payment.getPaymentMethod() != PaymentMethod.RAZORPAY) {
            return false;
        }

        // 2. Payment Status = PAID or REFUND_PENDING
        if (payment.getPaymentStatus() != PaymentStatus.PAID && payment.getPaymentStatus() != PaymentStatus.REFUND_PENDING) {
            return false;
        }

        // 3. Razorpay Payment ID exists
        if (payment.getRazorpayPaymentId() == null || payment.getRazorpayPaymentId().isBlank()) {
            return false;
        }

        // 4. Order has NOT already been refunded
        if (payment.getPaymentStatus() == PaymentStatus.REFUNDED) {
            return false;
        }

        boolean alreadyRefunded = refundRepository.existsByPaymentIdAndStatus(payment.getId(), RefundStatus.PROCESSED);
        return !alreadyRefunded;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public RefundResponse processAutomaticRefund(Order order, String reason) {
        long startTime = System.currentTimeMillis();

        if (order == null || order.getPayment() == null) {
            log.warn("Automatic refund skipped: Order or payment record is missing.");
            return null;
        }

        Payment payment = order.getPayment();

        // Check existing processed refund (DB Idempotency)
        Optional<Refund> existingRefund = refundRepository.findFirstByPaymentIdAndStatus(payment.getId(), RefundStatus.PROCESSED);
        if (existingRefund.isPresent()) {
            Refund refund = existingRefund.get();
            log.info("Duplicate refund attempt detected for Order ID: {}, Payment ID: {}. Returning existing Refund ID: {}",
                    order.getId(), payment.getId(), refund.getRazorpayRefundId());
            return mapToResponse(refund);
        }

        // Validate eligibility
        if (!isEligibleForRefund(order)) {
            log.info("Order ID: {} is not eligible for Razorpay refund. Payment Method: {}, Payment Status: {}",
                    order.getId(), payment.getPaymentMethod(), payment.getPaymentStatus());
            return null;
        }

        // Calculate refund amount strictly from backend order records (in paise)
        int refundAmountInPaise = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue();
        String razorpayPaymentId = payment.getRazorpayPaymentId();

        log.info("[AUDIT] Refund Started -> Order ID: {}, Order Number: {}, Payment ID: {}, Amount (Paise): {}",
                order.getId(), order.getOrderNumber(), maskId(razorpayPaymentId), refundAmountInPaise);

        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", refundAmountInPaise);
        if (reason != null && !reason.isBlank()) {
            JSONObject notes = new JSONObject();
            notes.put("reason", reason);
            notes.put("orderNumber", order.getOrderNumber());
            refundRequest.put("notes", notes);
        }

        try {
            // Call Razorpay API via Official Java SDK
            com.razorpay.Refund razorpayRefund = razorpayService.createRefund(razorpayPaymentId, refundRequest);
            String razorpayRefundId = razorpayRefund.get("id");

            // Save Refund Entity in refunds table
            Refund refund = Refund.builder()
                    .razorpayRefundId(razorpayRefundId)
                    .payment(payment)
                    .order(order)
                    .amount(refundAmountInPaise)
                    .reason(reason)
                    .status(RefundStatus.PROCESSED)
                    .createdAt(Instant.now())
                    .build();

            refund = refundRepository.save(refund);

            long duration = System.currentTimeMillis() - startTime;
            log.info("[AUDIT] Refund Success -> Order ID: {}, Payment ID: {}, Razorpay Refund ID: {}, Amount: ₹{}, Time Taken: {} ms",
                    order.getId(), maskId(razorpayPaymentId), maskId(razorpayRefundId), order.getTotalAmount(), duration);

            // Send email notification asynchronously
            try {
                Map<String, Object> model = new HashMap<>();
                model.put("order", order);
                model.put("refundAmount", order.getTotalAmount());
                model.put("refundStatus", refund.getStatus());
                model.put("reason", reason);
                emailService.sendTemplateEmail(
                        order.getCustomerEmail(),
                        "Refund Processed - " + order.getOrderNumber(),
                        "refund-confirmation",
                        model
                );
            } catch (Exception e) {
                log.error("Failed to send refund confirmation email for order {}: {}", order.getOrderNumber(), e.getMessage());
            }

            return mapToResponse(refund);

        } catch (RazorpayException e) {
            long duration = System.currentTimeMillis() - startTime;
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Razorpay API Exception";
            log.error("[AUDIT] Refund Failed -> Order ID: {}, Payment ID: {}, Error: {}, Time Taken: {} ms",
                    order.getId(), razorpayPaymentId, errorMsg, duration);

            // Record Failed Refund in refunds table ONLY (no writes to orders/payments to avoid deadlock)
            Refund failedRefund = Refund.builder()
                    .razorpayRefundId("FAILED_" + System.currentTimeMillis())
                    .payment(payment)
                    .order(order)
                    .amount(refundAmountInPaise)
                    .reason(reason)
                    .failureReason(errorMsg)
                    .status(RefundStatus.FAILED)
                    .createdAt(Instant.now())
                    .build();

            refundRepository.save(failedRefund);
            throw new BadRequestException("Razorpay refund failed: " + errorMsg);

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[AUDIT] Refund Failed -> Unexpected Error for Order ID: {}, Payment ID: {}, Error: {}, Time Taken: {} ms",
                    order.getId(), razorpayPaymentId, e.getMessage(), duration);

            throw new BadRequestException("Unexpected failure during refund processing: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public int retryFailedRefunds(int maxAttempts, int backoffBaseMinutes) {
        java.util.List<Refund> failedRefunds = refundRepository.findByStatus(RefundStatus.FAILED);
        if (failedRefunds.isEmpty()) {
            return 0;
        }

        int successCount = 0;
        Instant now = Instant.now();

        for (Refund refund : failedRefunds) {
            int currentRetryCount = refund.getRetryCount() != null ? refund.getRetryCount() : 0;
            if (currentRetryCount >= maxAttempts) {
                continue;
            }

            // Exponential backoff check: backoffBaseMinutes * 2^retryCount
            long backoffMinutes = backoffBaseMinutes * (1L << Math.min(currentRetryCount, 10));
            Instant lastAttempt = refund.getLastRetryAt() != null ? refund.getLastRetryAt() : refund.getCreatedAt();

            if (lastAttempt != null && now.isBefore(lastAttempt.plusSeconds(backoffMinutes * 60))) {
                continue; // Not yet time to retry according to exponential backoff
            }

            // Increment retry count and update lastRetryAt
            refund.setRetryCount(currentRetryCount + 1);
            refund.setLastRetryAt(now);

            Order order = refund.getOrder();
            Payment payment = refund.getPayment();

            if (order == null || payment == null || payment.getRazorpayPaymentId() == null) {
                refund.setFailureReason("Missing order or payment details for refund retry");
                refundRepository.save(refund);
                continue;
            }

            log.info("[AUDIT] Refund Retry -> Order ID: {}, Refund ID: {}, Attempt: {}/{}",
                    order.getId(), refund.getId(), refund.getRetryCount(), maxAttempts);

            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", refund.getAmount());
            if (refund.getReason() != null && !refund.getReason().isBlank()) {
                JSONObject notes = new JSONObject();
                notes.put("reason", refund.getReason());
                notes.put("orderNumber", order.getOrderNumber());
                refundRequest.put("notes", notes);
            }

            try {
                com.razorpay.Refund razorpayRefund = razorpayService.createRefund(payment.getRazorpayPaymentId(), refundRequest);
                String razorpayRefundId = razorpayRefund.get("id");

                refund.setRazorpayRefundId(razorpayRefundId);
                refund.setStatus(RefundStatus.PROCESSED);
                refund.setFailureReason(null);
                refundRepository.save(refund);

                payment.setPaymentStatus(com.tanuj.krishanaposhak.enums.PaymentStatus.REFUNDED);
                paymentRepository.save(payment);

                order.setPaymentStatus(com.tanuj.krishanaposhak.enums.PaymentStatus.REFUNDED);
                orderRepository.save(order);

                successCount++;
                log.info("[AUDIT] Refund Retry Success -> Order ID: {}, Payment ID: {}, Razorpay Refund ID: {}",
                        order.getId(), maskId(payment.getRazorpayPaymentId()), maskId(razorpayRefundId));
            } catch (RazorpayException e) {
                String errorMsg = e.getMessage() != null ? e.getMessage() : "Razorpay API Exception";
                refund.setFailureReason("Retry " + refund.getRetryCount() + " failed: " + errorMsg);
                refundRepository.save(refund);
                log.error("[AUDIT] Refund Retry Failed -> Order ID: {}, Attempt: {}, Error: {}",
                        order.getId(), refund.getRetryCount(), errorMsg);
            } catch (Exception e) {
                refund.setFailureReason("Retry " + refund.getRetryCount() + " unexpected error: " + e.getMessage());
                refundRepository.save(refund);
                log.error("[AUDIT] Refund Retry Unexpected Error -> Order ID: {}, Attempt: {}, Error: {}",
                        order.getId(), refund.getRetryCount(), e.getMessage());
            }
        }

        return successCount;
    }

    private RefundResponse mapToResponse(Refund refund) {
        return RefundResponse.builder()
                .id(refund.getId())
                .razorpayRefundId(refund.getRazorpayRefundId())
                .amount(refund.getAmount() != null ? refund.getAmount() / 100 : 0)
                .currency("INR")
                .status(refund.getStatus().toString())
                .reason(refund.getReason())
                .paymentId(refund.getPayment() != null ? refund.getPayment().getId() : null)
                .orderId(refund.getOrder() != null ? refund.getOrder().getId() : null)
                .build();
    }

    private String maskId(String id) {
        if (id == null) return "null";
        if (id.length() <= 8) return "****";
        return id.substring(0, 4) + "********" + id.substring(id.length() - 4);
    }
}
