package com.tanuj.krishanaposhak.dto.product;

import com.tanuj.krishanaposhak.enums.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ProductVariantRequest {

    @NotNull(message = "Size is required")
    private Size size;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @PositiveOrZero(message = "Discount price cannot be negative")
    private Double discountPrice;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @jakarta.validation.constraints.Size(max = 100, message = "SKU must not exceed 100 characters")
    private String sku;

    private boolean active = true;

}