package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.analytics.*;
import com.tanuj.krishanaposhak.service.ProductAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Product analytics API")
@SecurityRequirement(name = "bearerScheme")
public class AdminProductAnalyticsController {

    private final ProductAnalyticsService productAnalyticsService;

    @Operation(summary = "Get top selling products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top selling products retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductSalesDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/products/top-selling")
    public List<ProductSalesDto> getTopSellingProducts(
            @Parameter(description = "Maximum number of results to return (default: 10)", required = false) @RequestParam(defaultValue = "10") int limit) {
        return productAnalyticsService.getTopSellingProducts(limit);
    }

    @Operation(summary = "Get top rated products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top rated products retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductRatingDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/products/top-rated")
    public List<ProductRatingDto> getTopRatedProducts(
            @Parameter(description = "Maximum number of results to return (default: 10)", required = false) @RequestParam(defaultValue = "10") int limit) {
        return productAnalyticsService.getTopRatedProducts(limit);
    }

    @Operation(summary = "Get most reviewed products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Most reviewed products retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductMostReviewedDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/products/most-reviewed")
    public List<ProductMostReviewedDto> getMostReviewedProducts(
            @Parameter(description = "Maximum number of results to return (default: 10)", required = false) @RequestParam(defaultValue = "10") int limit) {
        return productAnalyticsService.getMostReviewedProducts(limit);
    }

    @Operation(summary = "Get most wishlisted products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Most wishlisted products retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductMostWishlistedDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/products/most-wishlisted")
    public List<ProductMostWishlistedDto> getMostWishlistedProducts(
            @Parameter(description = "Maximum number of results to return (default: 10)", required = false) @RequestParam(defaultValue = "10") int limit) {
        return productAnalyticsService.getMostWishlistedProducts(limit);
    }

    @Operation(summary = "Get low stock products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Low stock products retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductStockAnalyticsDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid threshold value"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/products/low-stock")
    public List<ProductStockAnalyticsDto> getLowStockProducts(
            @Parameter(description = "Stock threshold below which products are considered low stock (default: 10)", required = false) @RequestParam(defaultValue = "10") Integer threshold) {
        return productAnalyticsService.getLowStockProducts(threshold);
    }

    @Operation(summary = "Get out of stock products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Out of stock products retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductStockAnalyticsDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/products/out-of-stock")
    public List<ProductStockAnalyticsDto> getOutOfStockProducts() {
        return productAnalyticsService.getOutOfStockProducts();
    }

    @Operation(summary = "Get top selling categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top selling categories retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoryAnalyticsDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/api/admin/analytics/categories/top-selling")
    public List<CategoryAnalyticsDto> getTopSellingCategories(
            @Parameter(description = "Maximum number of results to return (default: 10)", required = false) @RequestParam(defaultValue = "10") int limit) {
        return productAnalyticsService.getTopSellingCategories(limit);
    }
}