package com.tanuj.krishanaposhak.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for top selling products analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSalesAnalyticsDto {
    private Long id;
    private String name;
    private String imageUrl;
    private String categoryName;
    private Long unitsSold;
    private Double revenue;
}