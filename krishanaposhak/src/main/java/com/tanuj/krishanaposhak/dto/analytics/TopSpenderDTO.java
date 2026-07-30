package com.tanuj.krishanaposhak.dto.analytics;

import java.time.LocalDateTime;
import java.math.BigDecimal;

/**
 * DTO for top spending customers.
 */
public record TopSpenderDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        Long totalOrders,
        BigDecimal totalSpent,
        LocalDateTime lastOrderDate
) {
}