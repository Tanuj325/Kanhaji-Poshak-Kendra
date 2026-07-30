package com.tanuj.krishanaposhak.dto.cart;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CartResponse {

    private List<CartItemResponse> items;

    private Integer totalItems;

    private Double subTotal;

    private Double discount;

    private Double shippingCharge;

    private Double grandTotal;

}