package com.tanuj.krishanaposhak.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for sales analytics data (graph-ready).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesDataDto {
    private String label;
    private Double revenue;
    private Long orders;
}