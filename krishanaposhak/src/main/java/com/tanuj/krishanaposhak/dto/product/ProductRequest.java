package com.tanuj.krishanaposhak.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Short description is required")
    private String shortDescription;

    private String description;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String material;

    private String careInstructions;

    private boolean featured;

    private boolean newArrival;

    private boolean active = true;

}