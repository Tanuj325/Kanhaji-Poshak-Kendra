package com.tanuj.krishanaposhak.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for admin dashboard overview statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalUsers;
    private Long activeUsers;
    private Long totalProducts;
    private Long activeProducts;
    private Long outOfStockProducts;
    private Long lowStockProducts;
    private Long totalCategories;
    private Long totalOrders;
    private Long pendingOrders;
    private Long confirmedOrders;
    private Long shippedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Long returnedOrders;
    private Double totalRevenue;
    private Double todayRevenue;
    private Double monthlyRevenue;
    private Double yearlyRevenue;
    private Double averageOrderValue;
    private Long totalReviews;
    private Double averageRating;
    private Long totalCoupons;
    private Long activeCoupons;
    private Long totalContactMessages;
    private Long unreadContactMessages;
}