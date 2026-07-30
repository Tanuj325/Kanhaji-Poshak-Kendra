package com.tanuj.krishanaposhak.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for most reviewed products analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductMostReviewedDto {
    private Long id;
    private String name;
    private String slug;
    private Long reviewCount;
}