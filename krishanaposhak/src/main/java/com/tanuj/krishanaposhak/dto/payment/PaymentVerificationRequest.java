package com.tanuj.krishanaposhak.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request object for verifying a Razorpay payment.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationRequest {

    /**
     * Razorpay order ID.
     */
    private String razorpayOrderId;

    /**
     * Razorpay payment ID.
     */
    private String razorpayPaymentId;

    /**
     * Razorpay signature.
     */
    private String razorpaySignature;
}