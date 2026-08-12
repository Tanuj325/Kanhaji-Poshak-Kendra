package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.payment.PaymentRequest;
import com.tanuj.krishanaposhak.dto.payment.PaymentResponse;
import com.tanuj.krishanaposhak.dto.payment.RazorpayOrderResponse;
import com.tanuj.krishanaposhak.dto.payment.RefundRequest;
import com.tanuj.krishanaposhak.dto.payment.RefundResponse;
import com.tanuj.krishanaposhak.enums.PaymentStatus;

/**
 * Service for payment operations.
 */
public interface PaymentService {

    RazorpayOrderResponse createRazorpayOrder(Long orderId);

    PaymentResponse initiatePayment(Long userId, PaymentRequest request);

    PaymentResponse verifyRazorpayPayment(Long userId,
                                          String razorpayOrderId,
                                          String razorpayPaymentId,
                                          String razorpaySignature);

    PaymentResponse verifyRazorpayPayment(Long userId,
                                          com.tanuj.krishanaposhak.dto.payment.PaymentVerificationRequest verificationRequest);

    PaymentResponse getPaymentByOrder(Long orderId);

    PaymentResponse getPaymentById(Long paymentId);

    PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus status);

    /**
     * Processes a Razorpay webhook event.
     * <p>
     * This method assumes the webhook signature has already been validated.
     *
     * @param eventId   the unique identifier of the webhook event
     * @param eventType the type of the webhook event (e.g., payment.captured)
     * @param payload   the raw payload of the webhook request
     */
    void processWebhookEvent(String eventId, String eventType, String payload);

    /**
     * Asynchronously processes a Razorpay webhook event after it has been accepted.
     * All exceptions are handled internally; this method never propagates exceptions.
     * <p>
     * This method assumes the webhook signature has already been validated and
     * the event has been recorded as RECEIVED.
     *
     * @param eventId   the unique identifier of the webhook event
     * @param eventType the type of the webhook event (e.g., payment.captured)
     * @param payload   the raw payload of the webhook request
     */
    void processWebhookEventAsync(String eventId, String eventType, String payload);

    /**
     * Initiates a refund for a payment.
     *
     * @param userId    the ID of the user requesting the refund
     * @param request   the refund request details
     * @return the refund response
     */
    RefundResponse createRefund(Long userId, RefundRequest request);

    /**
     * Retrieves refund details by refund ID.
     *
     * @param refundId the ID of the refund
     * @return the refund details
     */
    RefundResponse getRefundById(Long refundId);

    /**
     * Retrieves refund details by payment ID.
     *
     * @param paymentId the ID of the payment
     * @return the refund details
     */
    RefundResponse getRefundByPaymentId(Long paymentId);

    /**
     * Reconciles all pending/created Razorpay payments older than threshold using Razorpay API.
     */
    int reconcilePendingPayments();

    /**
     * Reconciles pending payments specifically for a given user (login/page load recovery).
     *
     * @param userId the ID of the user
     * @return summary of payment recovery
     */
    com.tanuj.krishanaposhak.dto.payment.PaymentRecoveryResponse reconcilePendingPaymentsForUser(Long userId);

    /**
     * Cleans up unpaid pending orders older than configurable timeout.
     */
    int cleanupUnpaidPendingOrders();

    /**
     * Gets admin payment monitoring telemetry and paginated payment records.
     */
    com.tanuj.krishanaposhak.dto.payment.AdminPaymentMonitoringResponse getAdminPaymentMonitoringData(
            String status, String search, int page, int size);

}