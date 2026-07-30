package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.coupon.ApplyCouponRequest;
import com.tanuj.krishanaposhak.dto.coupon.CouponRequest;
import com.tanuj.krishanaposhak.dto.coupon.CouponResponse;
import com.tanuj.krishanaposhak.dto.coupon.CouponValidationResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.service.CouponService;
import com.tanuj.krishanaposhak.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon management API")
@SecurityRequirement(name = "bearerScheme")
public class CouponController {

    private final CouponService couponService;
    private final JwtService jwtService;

    @Operation(summary = "Get all coupons with filtering and pagination (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupons retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaginationResponse<CouponResponse>> getAllCoupons(
            @Parameter(description = "Filter by coupon code") @RequestParam(required = false) String code,
            @Parameter(description = "Filter by active status") @RequestParam(required = false) Boolean active,
            @Parameter(description = "Filter by expired status") @RequestParam(required = false) Boolean expired,
            @Parameter(description = "Sort field and direction (e.g., 'code,asc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        PaginationResponse<CouponResponse> response = couponService.getCoupons(code, active, expired, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get active coupons for user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Active coupons retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CouponResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/active")
    public ResponseEntity<List<CouponResponse>> getActiveCoupon(HttpServletRequest request) {
        Long userId = extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @Operation(summary = "Get coupon by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CouponResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CouponResponse> getCouponById(HttpServletRequest request, @PathVariable Long id) {
        Long userId = extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(couponService.getCouponById(id));
    }

    @Operation(summary = "Get coupon by code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CouponResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    @GetMapping("/code/{code}")
    public ResponseEntity<CouponResponse> getCouponByCode(HttpServletRequest request, @PathVariable String code) {
        Long userId = extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(couponService.getCouponByCode(code));
    }

@Operation(summary = "Create coupon (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Coupon created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "409", description = "Coupon code already exists")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> createCoupon(
            @Valid @RequestBody CouponRequest request) {
        CouponResponse response = couponService.createCoupon(request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Update coupon (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Coupon not found"),
            @ApiResponse(responseCode = "409", description = "Coupon code already exists")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> updateCoupon(
            @Parameter(description = "Coupon ID", required = true) @PathVariable Long id,
            @Valid @RequestBody CouponRequest request) {
        CouponResponse response = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete coupon (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Coupon deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCoupon(@Parameter(description = "Coupon ID", required = true) @PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Toggle coupon status (active/inactive) (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Coupon status toggled successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleCouponStatus(@Parameter(description = "Coupon ID", required = true) @PathVariable Long id) {
        couponService.toggleCouponStatus(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Validate coupon")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon validation result",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CouponValidationResponse.class),
                            examples = @ExampleObject(value = "{\"valid\":true,\"discountAmount\":150.0,\"message\":\"Coupon applied successfully\"}"))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/validate")
    public ResponseEntity<CouponValidationResponse> validateCoupon(
            @Parameter(description = "Order amount") @RequestParam Double orderAmount,
            @Valid @RequestBody ApplyCouponRequest applyCouponRequest,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        CouponValidationResponse response =
                couponService.validateCoupon(userId, applyCouponRequest, orderAmount);

        return ResponseEntity.ok(response);
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return null;
        }
        return jwtService.extractUserId(token);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}