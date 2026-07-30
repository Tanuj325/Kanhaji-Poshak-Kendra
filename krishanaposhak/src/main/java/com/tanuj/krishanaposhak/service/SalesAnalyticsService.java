package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.analytics.SalesDataDto;
import java.util.List;

/**
 * Service for sales analytics.
 */
public interface SalesAnalyticsService {

    /**
     * Get daily sales data for the last 7 days (including today).
     * Each data point represents a day with label in format "dd MMM".
     *
     * @return list of sales data for the last 7 days
     */
    List<SalesDataDto> getDailySales();

    /**
     * Get weekly sales data for the last 7 weeks (including current week).
     * Each data point represents a week with label in format "Week w".
     *
     * @return list of sales data for the last 7 weeks
     */
    List<SalesDataDto> getWeeklySales();

    /**
     * Get monthly sales data for the last 12 months (including current month).
     * Each data point represents a month with label in format "MMM yyyy".
     *
     * @return list of sales data for the last 12 months
     */
    List<SalesDataDto> getMonthlySales();

    /**
     * Get yearly sales data for the last 5 years (including current year).
     * Each data point represents a year with label in format "yyyy".
     *
     * @return list of sales data for the last 5 years
     */
    List<SalesDataDto> getYearlySales();

    /**
     * Get sales data for a custom date range (inclusive of start, exclusive of end).
     * Each data point represents a day with label in format "dd MMM yyyy".
     *
     * @param startDate inclusive start date
     * @param endDate   exclusive end date
     * @return list of sales data for each day in the range
     */
    List<SalesDataDto> getCustomSales(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
}