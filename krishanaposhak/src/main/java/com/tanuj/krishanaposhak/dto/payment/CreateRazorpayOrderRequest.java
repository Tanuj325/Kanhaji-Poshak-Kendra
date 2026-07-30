package com.tanuj.krishanaposhak.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request object for creating a Razorpay order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRazorpayOrderRequest {

    /**
     * Amount in the smallest currency unit (e.g., paise for INR).
     * Must be positive.
     */
    private int amount;

    /**
     * Currency code (e.g., "INR").
     */
    private String currency;

    /**
     * Reference ID for the order (e.g., order number).
     */
    private String receipt;

    /**
     * Optional notes (key-value pairs).
     */
    private java.util.Map<String, String> notes;
}