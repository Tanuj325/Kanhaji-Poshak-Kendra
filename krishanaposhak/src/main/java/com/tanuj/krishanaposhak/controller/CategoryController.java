package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.category.CategoryDropdownResponse;
import com.tanuj.krishanaposhak.dto.category.CategoryRequest;
import com.tanuj.krishanaposhak.dto.category.CategoryResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.service.CategoryService;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management API")
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Get all categories with filtering and pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categories retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    @GetMapping
    public ResponseEntity<PaginationResponse<CategoryResponse>> getAllCategories(
            @Parameter(description = "Filter by category name") @RequestParam(required = false) String name,
            @Parameter(description = "Filter by active status") @RequestParam(required = false) Boolean active,
            @Parameter(description = "Sort field and direction (e.g., 'name,asc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        PaginationResponse<CategoryResponse> response = categoryService.getAllCategories(name, active, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get category dropdown list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category dropdown retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoryDropdownResponse.class)))
    })
    @GetMapping("/dropdown")
    public ResponseEntity<List<CategoryDropdownResponse>> getCategoryDropdown() {
        return ResponseEntity.ok(categoryService.getCategoryDropdown());
    }

    @Operation(summary = "Get root categories (no parent)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Root categories retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoryResponse.class)))
    })
    @GetMapping("/root")
    public ResponseEntity<List<CategoryResponse>> getRootCategories() {
        return ResponseEntity.ok(categoryService.getRootCategories());
    }

    @Operation(summary = "Get subcategories by parent ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subcategories retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Parent category not found")
    })
    @GetMapping("/{parentId}/subcategories")
    public ResponseEntity<List<CategoryResponse>> getSubCategories(
            @Parameter(description = "Parent category ID", required = true) @PathVariable Long parentId) {
        return ResponseEntity.ok(categoryService.getSubCategories(parentId));
    }

    @Operation(summary = "Get category by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @Parameter(description = "Category ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @Operation(summary = "Get category by slug")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoryResponse> getCategoryBySlug(
            @Parameter(description = "Category slug", required = true) @PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @Operation(summary = "Create a new category (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Category created successfully",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = CategoryResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @ModelAttribute CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Update category by ID (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = CategoryResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(@Parameter(description = "Category ID", required = true) @PathVariable Long id,
                                                           @Valid @ModelAttribute CategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete category by ID (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@Parameter(description = "Category ID", required = true) @PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Toggle category status (active/inactive) (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Category status toggled successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @PatchMapping("/{id}/toggle-status")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleCategoryStatus(@Parameter(description = "Category ID", required = true) @PathVariable Long id) {
        categoryService.toggleCategoryStatus(id);
        return ResponseEntity.noContent().build();
    }
}