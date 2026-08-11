package com.tanuj.krishanaposhak.dto.product;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductDetailsResponse {

    private Long id;

    private String name;

    private String slug;

    private String shortDescription;

    private String description;

    private String category;

    private String material;

    private String careInstructions;

    private String color;

    private List<ProductVariantResponse> variants;

    private List<ProductImageResponse> images;

}