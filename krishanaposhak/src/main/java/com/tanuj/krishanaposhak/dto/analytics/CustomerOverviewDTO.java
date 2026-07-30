package com.tanuj.krishanaposhak.dto.analytics;

/**
 * DTO for customer analytics overview.
 */
public record CustomerOverviewDTO(
        Long totalCustomers,
        Long activeCustomers,
        Long newCustomersToday,
        Long newCustomersThisWeek,
        Long newCustomersThisMonth,
        Long verifiedCustomers,
        Long unverifiedCustomers,
        Long customersWithOrders,
        Long customersWithoutOrders,
        Long repeatCustomers,
        Double averageOrdersPerCustomer,
        Double averageCustomerSpend
) {
}