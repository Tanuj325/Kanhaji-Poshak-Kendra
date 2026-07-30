package com.tanuj.krishanaposhak.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for stock based products analytics (low stock, out of stock).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStockAnalyticsDto {
    private Long id;
    private String name;
    private String slug;
    private Long stock;
}