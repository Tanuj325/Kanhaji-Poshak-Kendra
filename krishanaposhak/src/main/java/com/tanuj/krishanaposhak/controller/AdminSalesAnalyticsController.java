package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.analytics.SalesDataDto;
import com.tanuj.krishanaposhak.service.SalesAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Sales analytics API")
@SecurityRequirement(name = "bearerScheme")
public class AdminSalesAnalyticsController {

    private final SalesAnalyticsService salesAnalyticsService;

    @Operation(summary = "Get daily sales data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Daily sales data retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SalesDataDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/sales/daily")
    public List<SalesDataDto> getDailySales() {
        return salesAnalyticsService.getDailySales();
    }

    @Operation(summary = "Get weekly sales data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Weekly sales data retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SalesDataDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/sales/weekly")
    public List<SalesDataDto> getWeeklySales() {
        return salesAnalyticsService.getWeeklySales();
    }

    @Operation(summary = "Get monthly sales data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Monthly sales data retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SalesDataDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/sales/monthly")
    public List<SalesDataDto> getMonthlySales() {
        return salesAnalyticsService.getMonthlySales();
    }

    @Operation(summary = "Get yearly sales data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Yearly sales data retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SalesDataDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/sales/yearly")
    public List<SalesDataDto> getYearlySales() {
        return salesAnalyticsService.getYearlySales();
    }

    @Operation(summary = "Get custom range sales data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Custom range sales data retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SalesDataDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid date range"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/sales/custom")
    public List<SalesDataDto> getCustomSales(
            @Parameter(description = "Start date (ISO 8601 format)", required = true) @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO 8601 format)", required = true) @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return salesAnalyticsService.getCustomSales(startDate, endDate);
    }
}