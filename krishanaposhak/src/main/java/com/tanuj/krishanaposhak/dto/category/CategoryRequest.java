package com.tanuj.krishanaposhak.dto.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String description;

    private String imageUrl;

    private Long parentCategoryId;

    private Integer displayOrder;

    private boolean active = true;

}