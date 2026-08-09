package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.banner.BannerRequest;
import com.tanuj.krishanaposhak.dto.banner.BannerResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import org.springframework.http.MediaType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
@Tag(name = "Banners", description = "Banner management API")
@SecurityRequirement(name = "bearerScheme")
public class BannerController {

    private final BannerService bannerService;

    @Operation(summary = "Get active banners (public)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Banners retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = BannerResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<BannerResponse>> getActiveBanners() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }

    @Operation(summary = "Get all banners with filtering and pagination (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Banners retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaginationResponse<BannerResponse>> getAllBanners(
            @Parameter(description = "Filter by banner title") @RequestParam(required = false) String title,
            @Parameter(description = "Filter by active status") @RequestParam(required = false) Boolean active,
            @Parameter(description = "Sort field and direction (e.g., 'title,asc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        PaginationResponse<BannerResponse> response = bannerService.getBanners(title, active, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Create banner (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Banner created successfully",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = BannerResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> createBanner(@Valid @ModelAttribute BannerRequest request) {
        BannerResponse response = bannerService.createBanner(request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Update banner (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Banner updated successfully",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = BannerResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Banner not found")
    })
    @RequestMapping(value = "/{id}", method = {RequestMethod.PUT, RequestMethod.PATCH}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> updateBanner(@Parameter(description = "Banner ID", required = true) @PathVariable Long id, @Valid @ModelAttribute BannerRequest request) {
        BannerResponse response = bannerService.updateBanner(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete banner (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Banner deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Banner not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBanner(@Parameter(description = "Banner ID", required = true) @PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Toggle banner status (active/inactive) (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Banner status toggled successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Banner not found")
    })
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleBannerStatus(@Parameter(description = "Banner ID", required = true) @PathVariable Long id) {
        bannerService.toggleBannerStatus(id);
        return ResponseEntity.noContent().build();
    }
}