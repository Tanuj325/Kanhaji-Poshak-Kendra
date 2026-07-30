package com.tanuj.krishanaposhak.dto.product;

import com.tanuj.krishanaposhak.enums.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductVariantResponse {

    private Long id;

    private Size size;

    private Double price;

    private Double discountPrice;

    private Integer stock;

    private String sku;

    private boolean active;

}