package com.tanuj.krishanaposhak.dto.order;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {

    private Long id;

    private Long productId;

    private Long variantId;

    private String productName;

    private String sku;

    private String imageUrl;

    private String size;

    private String color;

    private Double price;

    private Integer quantity;

    private Double totalPrice;

}