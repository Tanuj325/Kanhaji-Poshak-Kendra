package com.tanuj.krishanaposhak.dto.payment;

import lombok.Builder;
import lombok.Data;

/**
 * Response object for creating a Razorpay order.
 */
@Data
@Builder
public class RazorpayOrderResponse {

    /**
     * Razorpay order ID.
     */
    private String id;

    /**
     * Currency of the order.
     */
    private String currency;

    /**
     * Amount in the smallest currency unit.
     */
    private Integer amount;

    /**
     * Razorpay key ID (to be used in the frontend).
     */
    private String key;

}