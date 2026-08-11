package com.tanuj.krishanaposhak.dto.payment;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
    @NotBlank(message = "Razorpay order ID is required")
    private String razorpayOrderId;

    /**
     * Razorpay payment ID.
     */
    @NotBlank(message = "Razorpay payment ID is required")
    private String razorpayPaymentId;

    /**
     * Razorpay signature. Excluded from toString to prevent secret leakage in logs.
     */
    @NotBlank(message = "Razorpay signature is required")
    @ToString.Exclude
    private String razorpaySignature;

    /**
     * Optional shipping address ID for checkout verification.
     */
    private Long shippingAddressId;

    /**
     * Optional coupon code used during checkout.
     */
    private String couponCode;

    /**
     * Optional delivery notes.
     */
    private String orderNotes;

    /**
     * Optional Buy Now flag.
     */
    private Boolean isBuyNow;

    /**
     * Optional variant ID for Buy Now flow.
     */
    private Long variantId;

    /**
     * Optional quantity for Buy Now flow.
     */
    private Integer quantity;

    /**
     * Optional color for Buy Now flow.
     */
    private String color;
}