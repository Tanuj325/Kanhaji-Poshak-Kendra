package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.review.ReviewRequest;
import com.tanuj.krishanaposhak.dto.review.ReviewResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.service.ReviewService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Review management API")
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtService jwtService;

    // Get reviews for a product (public endpoint)
    @Operation(summary = "Get reviews for a product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    @GetMapping("/product/{productId}")
    public ResponseEntity<PaginationResponse<ReviewResponse>> getReviewsByProduct(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId,
            @Parameter(description = "Filter by rating (1-5)") @RequestParam(required = false) Integer rating,
            @Parameter(description = "Sort field and direction (e.g., 'createdAt,desc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        PaginationResponse<ReviewResponse> response = reviewService.getReviewsByProduct(productId, rating, sort, page, size);
        return ResponseEntity.ok(response);
    }

    // Get average rating for a product (public endpoint)
    @Operation(summary = "Get average rating for a product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Average rating retrieved successfully",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getAverageRating(productId));
    }

    // Add a review (authenticated user)
    @Operation(summary = "Add a review for a product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review added successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ReviewResponse.class),
                            examples = @ExampleObject(value = "{\"id\":1,\"productId\":123,\"userId\":456,\"rating\":5,\"comment\":\"Great product!\",\"createdAt\":\"2023-05-15T10:30:00\"}"))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    @SecurityRequirement(name = "bearerScheme")
    public ResponseEntity<ReviewResponse> addReview(
            @Valid @RequestBody ReviewRequest reviewRequest,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        ReviewResponse response = reviewService.addReview(userId, reviewRequest);
        return ResponseEntity.status(201).body(response);
    }

    // Update a review (authenticated user must own the review)
    @Operation(summary = "Update a review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ReviewResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - You do not own this review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @PutMapping("/{reviewId}")
    @SecurityRequirement(name = "bearerScheme")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest reviewRequest,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        ReviewResponse response = reviewService.updateReview(userId, reviewId, reviewRequest);
        return ResponseEntity.ok(response);
    }

    // Delete a review (authenticated user must own the review)
    @Operation(summary = "Delete a review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - You do not own this review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @DeleteMapping("/{reviewId}")
    @SecurityRequirement(name = "bearerScheme")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId, HttpServletRequest request) {
        Long userId = extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        reviewService.deleteReview(userId, reviewId);
        return ResponseEntity.noContent().build();
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