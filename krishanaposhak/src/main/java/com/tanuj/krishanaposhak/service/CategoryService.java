package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.category.CategoryDropdownResponse;
import com.tanuj.krishanaposhak.dto.category.CategoryRequest;
import com.tanuj.krishanaposhak.dto.category.CategoryResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;

import java.util.List;

public interface CategoryService {

    PaginationResponse<CategoryResponse> getAllCategories(String name, Boolean active, String sort, int page, int size);

    List<CategoryDropdownResponse> getCategoryDropdown();

    List<CategoryResponse> getRootCategories();

    List<CategoryResponse> getSubCategories(Long parentCategoryId);

    CategoryResponse getCategoryById(Long id);

    CategoryResponse getCategoryBySlug(String slug);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);

    void toggleCategoryStatus(Long id);

}