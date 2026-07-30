package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.wishlist.WishlistRequest;
import com.tanuj.krishanaposhak.dto.wishlist.WishlistResponse;
import com.tanuj.krishanaposhak.service.WishlistService;
import com.tanuj.krishanaposhak.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
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

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist management API")
@SecurityRequirement(name = "bearerScheme")
public class WishlistController {

    private final WishlistService wishlistService;
    private final JwtService jwtService;

    @Operation(summary = "Get user's wishlist")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Wishlist retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = WishlistResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getWishlist(HttpServletRequest request) {
        Long userId = extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @Operation(summary = "Add product to wishlist")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Item added to wishlist",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = WishlistResponse.class),
                            examples = @ExampleObject(value = "{\"id\":1,\"productVariantId\":123,\"productName\":\"Kurta\",\"addedAt\":\"2023-05-15T10:30:00\"}"))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<WishlistResponse> addToWishlist(
            @Valid @RequestBody WishlistRequest wishlistRequest,
            HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        WishlistResponse response = wishlistService.addToWishlist(userId, wishlistRequest);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Remove item from wishlist")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Item removed from wishlist"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Item not found in wishlist")
    })
    @DeleteMapping("/{productVariantId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productVariantId, HttpServletRequest request) {
        Long userId = extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        wishlistService.removeFromWishlist(userId, productVariantId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Check if product is in wishlist")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Check completed",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/{productVariantId}/check")
    public ResponseEntity<Boolean> isInWishlist(@PathVariable Long productVariantId, HttpServletRequest request) {
        Long userId = extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        boolean inWishlist = wishlistService.isInWishlist(userId, productVariantId);
        return ResponseEntity.ok(inWishlist);
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