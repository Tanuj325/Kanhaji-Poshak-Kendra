package com.tanuj.krishanaposhak.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for top rated products analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRatingDto {
    private Long id;
    private String name;
    private String slug;
    private Double averageRating;
    private Long reviewCount;
}