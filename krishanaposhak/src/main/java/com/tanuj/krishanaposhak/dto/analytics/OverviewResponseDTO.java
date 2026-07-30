package com.tanuj.krishanaposhak.dto.analytics;

/**
 * DTO for admin dashboard overview statistics.
 */
public record OverviewResponseDTO(
        Long totalUsers,
        Long activeUsers,
        Long verifiedCustomers,
        Long unverifiedCustomers,
        Long todayRegisteredUsers,
        Long thisWeekRegisteredUsers,
        Long thisMonthRegisteredUsers
) {
}