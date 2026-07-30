package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.product.ProductImageRequest;
import com.tanuj.krishanaposhak.dto.product.ProductImageResponse;
import com.tanuj.krishanaposhak.service.ProductImageService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/products/{productId}/images")
@RequiredArgsConstructor
@Tag(name = "Product Images", description = "Product image management API")
@SecurityRequirement(name = "bearerScheme")
@CrossOrigin("*")
public class ProductImageController {

    private final ProductImageService productImageService;

    @Operation(summary = "Get all images for a product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Images retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductImageResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<ProductImageResponse>> getImagesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getImagesByProduct(productId));
    }

    @Operation(summary = "Add image to product (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Image uploaded successfully",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = ProductImageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductImageResponse> addImage(@PathVariable Long productId, @Valid @ModelAttribute ProductImageRequest request) {
        ProductImageResponse response = productImageService.addImage(productId, request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Update product image (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image updated successfully",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = ProductImageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Image not found")
    })
    @PutMapping(value = "/{imageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductImageResponse> updateImage(@PathVariable Long productId, @PathVariable Long imageId, @Valid @ModelAttribute ProductImageRequest request) {
        ProductImageResponse response = productImageService.updateImage(productId, imageId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete product image (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Image deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Image not found")
    })
    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productImageService.deleteImage(productId, imageId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Set product thumbnail (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Thumbnail set successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductImageResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Image not found")
    })
    @PostMapping("/{imageId}/thumbnail")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductImageResponse> setThumbnail(@PathVariable Long productId, @PathVariable Long imageId) {
        ProductImageResponse response = productImageService.setThumbnail(productId, imageId);
        return ResponseEntity.ok(response);
    }
}