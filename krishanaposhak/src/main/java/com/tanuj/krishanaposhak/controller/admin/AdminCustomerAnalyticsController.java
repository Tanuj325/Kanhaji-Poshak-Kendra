package com.tanuj.krishanaposhak.controller.admin;

import com.tanuj.krishanaposhak.dto.analytics.*;
import com.tanuj.krishanaposhak.service.CustomerAnalyticsService;
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
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * REST controller for customer analytics endpoints.
 * Only accessible by users with ADMIN role.
 */
@RestController
@RequestMapping("/api/admin/analytics/customers")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Customer analytics API")
@SecurityRequirement(name = "bearerScheme")
public class AdminCustomerAnalyticsController {

    private final CustomerAnalyticsService customerAnalyticsService;

    @Operation(summary = "Get customer analytics overview")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Customer overview retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CustomerOverviewDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/overview")
    public ResponseEntity<CustomerOverviewDTO> getOverview() {
        CustomerOverviewDTO overview = customerAnalyticsService.getOverview();
        return ResponseEntity.ok(overview);
    }

    @Operation(summary = "Get new users (registered in the last 7 days)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "New users retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserSummaryDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/new")
    public ResponseEntity<Page<UserSummaryDTO>> getNewUsers(@Parameter(description = "Pagination information") @PageableDefault(size = 20) Pageable pageable) {
        Page<UserSummaryDTO> newUsers = customerAnalyticsService.getNewUsers(pageable);
        return ResponseEntity.ok(newUsers);
    }

    @Operation(summary = "Get repeat customers (users with more than one order)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Repeat customers retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserSummaryDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/repeat")
    public ResponseEntity<Page<UserSummaryDTO>> getRepeatCustomers(@Parameter(description = "Pagination information") @PageableDefault(size = 20) Pageable pageable) {
        Page<UserSummaryDTO> repeatCustomers = customerAnalyticsService.getRepeatCustomers(pageable);
        return ResponseEntity.ok(repeatCustomers);
    }

    @Operation(summary = "Get inactive users (no orders in the last 30 days)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inactive users retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserSummaryDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/inactive")
    public ResponseEntity<Page<UserSummaryDTO>> getInactiveUsers(@Parameter(description = "Pagination information") @PageableDefault(size = 20) Pageable pageable) {
        Page<UserSummaryDTO> inactiveUsers = customerAnalyticsService.getInactiveUsers(pageable);
        return ResponseEntity.ok(inactiveUsers);
    }

    @Operation(summary = "Get recent users (latest registered users)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recent users retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserSummaryDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/recent")
    public ResponseEntity<Page<UserSummaryDTO>> getRecentUsers(@Parameter(description = "Pagination information") @PageableDefault(size = 20) Pageable pageable) {
        Page<UserSummaryDTO> recentUsers = customerAnalyticsService.getRecentUsers(pageable);
        return ResponseEntity.ok(recentUsers);
    }

    @Operation(summary = "Get top spending customers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top spending customers retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TopSpenderDTO.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/top-spenders")
    public ResponseEntity<Page<TopSpenderDTO>> getTopSpenders(@Parameter(description = "Pagination information") @PageableDefault(size = 20) Pageable pageable) {
        Page<TopSpenderDTO> topSpenders = customerAnalyticsService.getTopSpenders(pageable);
        return ResponseEntity.ok(topSpenders);
    }
}