package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.payment.RefundResponse;
import com.tanuj.krishanaposhak.entity.Order;

public interface RefundService {

    /**
     * Processes an automated Razorpay refund when an order is cancelled or stock is exhausted.
     * Runs in a REQUIRES_NEW transaction so the Refund entity + Razorpay API call commit
     * independently of the caller's transaction.
     *
     * @param order the order being refunded
     * @param reason the reason for cancellation/refund
     * @return RefundResponse containing refund details or null if ineligible
     */
    RefundResponse processAutomaticRefund(Order order, String reason);

    /**
     * Checks whether an order is eligible for an automated Razorpay refund.
     *
     * @param order the order to check
     * @return true if eligible, false otherwise
     */
    boolean isEligibleForRefund(Order order);

    /**
     * Retries automatic refunds for records with status FAILED using exponential backoff.
     *
     * @param maxAttempts maximum retry attempts before stopping
     * @param backoffBaseMinutes base minutes for exponential backoff calculation
     * @return number of successfully retried refunds
     */
    int retryFailedRefunds(int maxAttempts, int backoffBaseMinutes);
}
