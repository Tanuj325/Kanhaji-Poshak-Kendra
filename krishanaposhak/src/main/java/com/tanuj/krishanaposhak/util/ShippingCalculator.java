package com.tanuj.krishanaposhak.util;

import java.math.BigDecimal;

/**
 * Utility class for calculating shipping charges based on order subtotal according to business rules:
 * - Subtotal == 0                   => Shipping = ₹0
 * - Subtotal < ₹2,000               => Shipping = ₹120
 * - Subtotal ₹2,000 – ₹3,999.99     => Shipping = ₹240
 * - Subtotal ₹4,000 – ₹7,999.99     => Shipping = ₹400
 * - Subtotal ≥ ₹8,000               => Shipping = ₹0 (FREE DELIVERY)
 */
public final class ShippingCalculator {

    public static final double FREE_SHIPPING_THRESHOLD = 8000.0;

    private ShippingCalculator() {
        // Utility class
    }

    /**
     * Calculates shipping charge as a BigDecimal.
     *
     * @param amount Subtotal after discount or cart subtotal
     * @return Shipping charge
     */
    public static BigDecimal calculateShippingCharge(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        double val = amount.doubleValue();
        if (val < 2000.0) {
            return BigDecimal.valueOf(120.0);
        } else if (val < 4000.0) {
            return BigDecimal.valueOf(240.0);
        } else if (val < 8000.0) {
            return BigDecimal.valueOf(400.0);
        } else {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Calculates shipping charge as a double.
     *
     * @param amount Subtotal amount
     * @return Shipping charge
     */
    public static double calculateShippingCharge(double amount) {
        if (amount <= 0.0) {
            return 0.0;
        }
        if (amount < 2000.0) {
            return 120.0;
        } else if (amount < 4000.0) {
            return 240.0;
        } else if (amount < 8000.0) {
            return 400.0;
        } else {
            return 0.0;
        }
    }
}
