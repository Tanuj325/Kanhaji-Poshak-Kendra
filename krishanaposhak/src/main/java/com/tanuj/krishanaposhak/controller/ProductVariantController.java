package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.product.ProductVariantRequest;
import com.tanuj.krishanaposhak.dto.product.ProductVariantResponse;
import com.tanuj.krishanaposhak.service.ProductVariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
@RequestMapping("/api/products/{productId}/variants")
@RequiredArgsConstructor
@Tag(name = "Product Variants", description = "Product variant management API")
@CrossOrigin("*")
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @Operation(summary = "Get all variants for a product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Variants retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductVariantResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<ProductVariantResponse>> getVariantsByProduct(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId) {

        return ResponseEntity.ok(productVariantService.getVariantsByProduct(productId));
    }

    @Operation(summary = "Get variant by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Variant retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductVariantResponse.class))),
            @ApiResponse(responseCode = "404", description = "Variant not found")
    })
    @GetMapping("/{variantId}")
    public ResponseEntity<ProductVariantResponse> getVariantById(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId,
            @Parameter(description = "Variant ID", required = true) @PathVariable Long variantId) {

        ProductVariantResponse response = productVariantService.getVariantById(variantId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Add variant to product (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Variant created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductVariantResponse.class),
                            examples = @ExampleObject(value = "{\"id\":1,\"name\":\"Size\",\"value\":\"Large\",\"additionalPrice\":299.99}"))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PostMapping
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductVariantResponse> addVariant(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId,
            @Valid @RequestBody ProductVariantRequest request) {

        ProductVariantResponse response = productVariantService.addVariant(productId, request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Update variant (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Variant updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductVariantResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Variant not found")
    })
    @PutMapping("/{variantId}")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductVariantResponse> updateVariant(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId,
            @Parameter(description = "Variant ID", required = true) @PathVariable Long variantId,
            @Valid @RequestBody ProductVariantRequest request) {

        ProductVariantResponse response =
                productVariantService.updateVariant(productId, variantId, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete variant (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Variant deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Variant not found")
    })
    @DeleteMapping("/{variantId}")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVariant(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId,
            @Parameter(description = "Variant ID", required = true) @PathVariable Long variantId) {

        productVariantService.deleteVariant(productId, variantId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Toggle variant status (active/inactive) (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Variant status toggled successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Variant not found")
    })
    @PatchMapping("/{variantId}/toggle-status")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleVariantStatus(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId,
            @Parameter(description = "Variant ID", required = true) @PathVariable Long variantId) {

        productVariantService.toggleVariantStatus(variantId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update variant stock (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Stock updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid stock value"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Variant not found")
    })
    @PatchMapping("/{variantId}/stock")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateStock(
            @Parameter(description = "Product ID", required = true) @PathVariable Long productId,
            @Parameter(description = "Variant ID", required = true) @PathVariable Long variantId,
            @Parameter(description = "Stock quantity") @RequestParam Integer stock) {

        productVariantService.updateStock(variantId, stock);
        return ResponseEntity.noContent().build();
    }
}