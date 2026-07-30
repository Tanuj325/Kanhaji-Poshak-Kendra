package com.tanuj.krishanaposhak.dto.order;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlaceOrderRequest {

    @NotNull(message = "Shipping address is required")
    private Long shippingAddressId;

    private Long billingAddressId;

    private String couponCode;

    private String paymentMethod;

    private String orderNotes;

}