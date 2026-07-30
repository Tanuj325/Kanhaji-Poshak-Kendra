package com.tanuj.krishanaposhak.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response object for creating a Razorpay order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRazorpayOrderResponse {

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
    private int amount;

    /**
     * Razorpay key ID (to be used in the frontend).
     */
    private String key;
}