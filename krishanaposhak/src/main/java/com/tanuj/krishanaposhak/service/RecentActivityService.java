package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.analytics.ActivityResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service for retrieving recent activities.
 */
public interface RecentActivityService {

    /**
     * Get recent activities with pagination and optional type filter.
     *
     * @param pageable pagination information
     * @param type     optional activity type to filter by (e.g., ORDER_PLACED, PAYMENT_SUCCESS)
     * @return page of recent activities
     */
    Page<ActivityResponseDTO> getRecentActivities(Pageable pageable, String type);
}