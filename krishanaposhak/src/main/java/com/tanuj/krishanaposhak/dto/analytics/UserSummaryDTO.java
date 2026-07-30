package com.tanuj.krishanaposhak.dto.analytics;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for user summary in analytics lists.
 */
public record UserSummaryDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        LocalDateTime createdAt,
        LocalDateTime lastOrderDate,
        Long orderCount,
        BigDecimal totalSpent
) {
}