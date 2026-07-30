package com.tanuj.krishanaposhak.dto.product;

import com.tanuj.krishanaposhak.enums.Size;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductVariantRequest {

    @NotNull
    private Size size;

    @NotNull
    private Double price;

    private Double discountPrice;

    @NotNull
    private Integer stock;

    private String sku;

    private boolean active = true;

}