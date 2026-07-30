package com.tanuj.krishanaposhak.dto.analytics;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for category analytics data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryAnalyticsDto {
    private Long id;
    private String name;
    private String slug;
    private Long productsSold;
    private Long quantitySold;
    private BigDecimal revenue;
}