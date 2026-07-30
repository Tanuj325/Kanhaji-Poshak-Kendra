package com.tanuj.krishanaposhak.dto.analytics;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for recent activity feed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDTO {
    private Long id;
    private String type;
    private String description;
    private LocalDateTime createdAt;
    private String entityType;
    private Long entityId;
    private String entityName;
}