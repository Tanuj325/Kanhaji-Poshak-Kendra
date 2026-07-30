package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.category.CategoryDropdownResponse;
import com.tanuj.krishanaposhak.dto.category.CategoryRequest;
import com.tanuj.krishanaposhak.dto.category.CategoryResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.entity.Category;
import com.tanuj.krishanaposhak.exception.DuplicateResourceException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.CategoryMapper;
import com.tanuj.krishanaposhak.repository.CategoryRepository;
import com.tanuj.krishanaposhak.service.CategoryService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<CategoryResponse> getAllCategories(String name, Boolean active, String sort, int page, int size) {
        Specification<Category> spec = buildSpecification(name, active);
        Pageable pageable = buildPageable(sort, page, size);
        Page<Category> categoryPage = categoryRepository.findAll(spec, pageable);
        return toPaginationResponse(categoryPage, categoryMapper.toResponseList(categoryPage.getContent()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDropdownResponse> getCategoryDropdown() {
        return categoryMapper.toDropdownResponseList(
                categoryRepository.findByActiveTrueOrderByDisplayOrderAsc());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getRootCategories() {
        return categoryMapper.toResponseList(
                categoryRepository.findByParentCategoryIsNullAndActiveTrueOrderByDisplayOrderAsc());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getSubCategories(Long parentCategoryId) {
        return categoryMapper.toResponseList(
                categoryRepository.findByParentCategoryIdAndActiveTrue(parentCategoryId));
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        return categoryMapper.toResponse(findCategoryOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Category slug already exists: " + request.getSlug());
        }
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Category name already exists: " + request.getName());
        }

        Category category = categoryMapper.toEntity(request);
        category.setParentCategory(resolveParent(request.getParentCategoryId()));

        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        Category category = findCategoryOrThrow(id);

        categoryRepository.findBySlug(request.getSlug())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("Category slug already exists: " + request.getSlug());
                });

        categoryMapper.updateEntityFromRequest(request, category);
        category.setParentCategory(resolveParent(request.getParentCategoryId()));

        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = findCategoryOrThrow(id);
        categoryRepository.delete(category);
    }

    @Override
    public void toggleCategoryStatus(Long id) {
        Category category = findCategoryOrThrow(id);
        category.setActive(!Boolean.TRUE.equals(category.getActive()));
        categoryRepository.save(category);
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private Category resolveParent(Long parentCategoryId) {
        if (parentCategoryId == null) {
            return null;
        }
        return categoryRepository.findById(parentCategoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Parent category not found with id: " + parentCategoryId));
    }

    private Specification<Category> buildSpecification(String name, Boolean active) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.isNotBlank(name)) {
                String likePattern = "%" + name.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), likePattern));
            }
            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Pageable buildPageable(String sort, int page, int size) {
        if (StringUtils.isNotBlank(sort)) {
            String[] parts = StringUtils.split(sort, ',');
            if (parts.length == 2) {
                String property = parts[0].trim();
                String direction = parts[1].trim().toUpperCase();
                Sort.Direction sortDirection = "DESC".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
                return PageRequest.of(page, size, Sort.by(sortDirection, property));
            }
        }
        // Default sort by name ascending
        return PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
    }

    private <T> PaginationResponse<T> toPaginationResponse(Page<?> page, List<T> content) {
        return PaginationResponse.<T>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}