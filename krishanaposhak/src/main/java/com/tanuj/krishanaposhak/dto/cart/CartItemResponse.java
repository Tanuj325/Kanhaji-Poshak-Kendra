package com.tanuj.krishanaposhak.dto.cart;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {

    private Long cartItemId;

    private Long productId;

    private Long variantId;

    private String productName;

    private String slug;

    private String imageUrl;

    private String size;

    private String color;

    private Double price;

    private Double discountPrice;

    private Integer quantity;

    private Double totalPrice;

    private Integer stock;

}