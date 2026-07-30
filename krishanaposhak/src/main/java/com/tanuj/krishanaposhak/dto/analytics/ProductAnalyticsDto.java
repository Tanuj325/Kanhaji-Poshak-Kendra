package com.tanuj.krishanaposhak.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for product analytics data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAnalyticsDto {
    private Long id;
    private String name;
    private String imageUrl;
    private Long unitsSold;
    private Double revenue;
    private Double averageRating;
    private Long reviewCount;
    private Long wishlistCount;
    private Integer stock;
    private String categoryName;
}