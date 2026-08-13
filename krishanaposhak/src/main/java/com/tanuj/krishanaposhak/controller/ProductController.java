package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.dto.product.ProductCardResponse;
import com.tanuj.krishanaposhak.dto.product.ProductDetailsResponse;
import com.tanuj.krishanaposhak.dto.product.ProductRequest;
import com.tanuj.krishanaposhak.dto.product.ProductResponse;
import com.tanuj.krishanaposhak.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
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

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management API")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    // Public endpoints (GET only, as per SecurityConfig)
    @Operation(summary = "Get all products (public)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of products retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    @GetMapping
    public ResponseEntity<PaginationResponse<ProductCardResponse>> getAllProducts(
            @Parameter(description = "Filter by category ID or slug") @RequestParam(required = false) String categoryId,
            @Parameter(description = "Search term for product name") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by featured flag") @RequestParam(required = false) Boolean featured,
            @Parameter(description = "Filter by active flag") @RequestParam(required = false) Boolean active,
            @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Filter by in-stock status") @RequestParam(required = false) Boolean inStock,
            @Parameter(description = "Minimum rating (1-5)") @RequestParam(required = false) Double minRating,
            @Parameter(description = "Sort field and direction (e.g., 'price,asc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        PaginationResponse<ProductCardResponse> response = productService.getAllProducts(categoryId, search, featured, active, minPrice, maxPrice, inStock, minRating, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get product by ID (public)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product details retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get product by slug (public)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product details retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductDetailsResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDetailsResponse> getProductBySlug(@PathVariable String slug) {
        ProductDetailsResponse response = productService.getProductBySlug(slug);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get featured products (public)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of featured products retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductCardResponse.class))),
            @ApiResponse(responseCode = "404", description = "No featured products found")
    })
    @GetMapping("/featured")
    public ResponseEntity<java.util.List<ProductCardResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @Operation(summary = "Get new arrivals (public)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of new arrival products retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductCardResponse.class))),
            @ApiResponse(responseCode = "404", description = "No new arrivals found")
    })
    @GetMapping("/new-arrivals")
    public ResponseEntity<java.util.List<ProductCardResponse>> getNewArrivals() {
        return ResponseEntity.ok(productService.getNewArrivals());
    }

    // Admin endpoints
    @Operation(summary = "Get all products (admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of products retrieved for admin",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    @SecurityRequirement(name = "bearerScheme")
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaginationResponse<ProductResponse>> getAllProductsForAdmin(
            @Parameter(description = "Filter by category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Search term for product name") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by featured flag") @RequestParam(required = false) Boolean featured,
            @Parameter(description = "Filter by active flag") @RequestParam(required = false) Boolean active,
            @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Filter by in-stock status") @RequestParam(required = false) Boolean inStock,
            @Parameter(description = "Minimum rating (1-5)") @RequestParam(required = false) Double minRating,
            @Parameter(description = "Sort field and direction (e.g., 'price,asc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        PaginationResponse<ProductResponse> response = productService.getAllProductsForAdmin(categoryId, search, featured, active, minPrice, maxPrice, inStock, minRating, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Create product (admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @SecurityRequirement(name = "bearerScheme")
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Update product (admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @SecurityRequirement(name = "bearerScheme")
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete product (admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @SecurityRequirement(name = "bearerScheme")
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Toggle product status (admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product status toggled successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @SecurityRequirement(name = "bearerScheme")
    @PatchMapping("/admin/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleProductStatus(@PathVariable Long id) {
        productService.toggleProductStatus(id);
        return ResponseEntity.noContent().build();
    }
}