package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.analytics.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service for customer analytics.
 */
public interface CustomerAnalyticsService {

    /**
     * Get customer analytics overview.
     *
     * @return overview of customer statistics
     */
    CustomerOverviewDTO getOverview();

    /**
     * Get new users (registered in the last 7 days).
     *
     * @param pageable pagination information
     * @return page of new users
     */
    Page<UserSummaryDTO> getNewUsers(Pageable pageable);

    /**
     * Get repeat customers (users with more than one order).
     *
     * @param pageable pagination information
     * @return page of repeat customers
     */
    Page<UserSummaryDTO> getRepeatCustomers(Pageable pageable);

    /**
     * Get inactive users (no orders in the last 30 days).
     *
     * @param pageable pagination information
     * @return page of inactive users
     */
    Page<UserSummaryDTO> getInactiveUsers(Pageable pageable);

    /**
     * Get recent users (latest registered users).
     *
     * @param pageable pagination information
     * @return page of recent users
     */
    Page<UserSummaryDTO> getRecentUsers(Pageable pageable);

    /**
     * Get top spending customers.
     *
     * @param pageable pagination information
     * @return page of top spenders
     */
    Page<TopSpenderDTO> getTopSpenders(Pageable pageable);
}