package com.tanuj.krishanaposhak.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 150, message = "Name must be 150 characters or less")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(max = 180, message = "Slug must be 180 characters or less")
    private String slug;

    @NotBlank(message = "Short description is required")
    @Size(max = 300, message = "Short description must be 300 characters or less")
    private String shortDescription;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Category is required")
    @Positive(message = "Category ID must be positive")
    private Long categoryId;

    private String material;

    private String careInstructions;

    @Size(max = 50, message = "Color must be 50 characters or less")
    private String color;

    private boolean featured;

    private boolean newArrival;

    private boolean active = true;

}