package com.tanuj.krishanaposhak.controller.admin;

import com.tanuj.krishanaposhak.dto.analytics.ActivityResponseDTO;
import com.tanuj.krishanaposhak.service.RecentActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/analytics/activity")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Recent activity API")
@SecurityRequirement(name = "bearerScheme")
public class RecentActivityAdminController {

    private final RecentActivityService recentActivityService;

    @Operation(summary = "Get recent activities across the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recent activities retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ActivityResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping
    public ResponseEntity<Page<ActivityResponseDTO>> getRecentActivities(@Parameter(description = "Pagination information") @PageableDefault(size = 20) Pageable pageable,
                                                                         @Parameter(description = "Optional activity type to filter by (e.g., ORDER_PLACED, PAYMENT_SUCCESS)") @RequestParam(required = false) String type) {
        Page<ActivityResponseDTO> activities = recentActivityService.getRecentActivities(pageable, type);
        return ResponseEntity.ok(activities);
    }
}