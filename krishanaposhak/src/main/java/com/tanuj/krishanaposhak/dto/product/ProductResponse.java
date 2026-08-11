package com.tanuj.krishanaposhak.dto.product;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String slug;

    private String shortDescription;

    private String description;

    private Long categoryId;

    private String categoryName;

    private String material;

    private String careInstructions;

    private String color;

    private boolean featured;

    private boolean newArrival;

    private boolean active;

    private List<ProductVariantResponse> variants;

    private List<ProductImageResponse> images;

}