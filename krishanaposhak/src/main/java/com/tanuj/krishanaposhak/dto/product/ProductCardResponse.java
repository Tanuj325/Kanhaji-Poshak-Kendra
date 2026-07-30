package com.tanuj.krishanaposhak.dto.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductCardResponse {

    private Long id;

    private Long variantId;

    private String name;

    private String slug;

    private String imageUrl;

    private Double price;

    private Double discountPrice;

    private String size;

    private boolean featured;

    private boolean newArrival;

}