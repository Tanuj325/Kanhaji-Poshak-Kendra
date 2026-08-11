package com.tanuj.krishanaposhak.dto.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlaceOrderRequest {

    @NotNull(message = "Shipping address is required")
    @Positive(message = "Shipping address ID must be positive")
    private Long shippingAddressId;

    @Positive(message = "Billing address ID must be positive")
    private Long billingAddressId;

    @Size(max = 50, message = "Coupon code must not exceed 50 characters")
    private String couponCode;

    @Size(max = 50, message = "Payment method must not exceed 50 characters")
    private String paymentMethod;

    @Size(max = 1000, message = "Order notes must not exceed 1000 characters")
    private String orderNotes;

    private Boolean isBuyNow;

    @Positive(message = "Variant ID must be positive")
    private Long variantId;

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @Size(max = 50, message = "Color must not exceed 50 characters")
    private String color;

}