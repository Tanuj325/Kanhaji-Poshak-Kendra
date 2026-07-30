package com.tanuj.krishanaposhak.dto.analytics;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for top selling products analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSalesDto {
    private Long id;
    private String name;
    private String slug;
    private Long unitsSold;
    private BigDecimal revenue;
}