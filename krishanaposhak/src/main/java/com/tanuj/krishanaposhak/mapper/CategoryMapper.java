package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.category.CategoryDropdownResponse;
import com.tanuj.krishanaposhak.dto.category.CategoryRequest;
import com.tanuj.krishanaposhak.dto.category.CategoryResponse;
import com.tanuj.krishanaposhak.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    // parentCategory is resolved from parentCategoryId in the service layer, then set manually.
    // Category uses plain @Builder, so inherited BaseEntity fields like "id" aren't builder
    // properties at all — nothing to ignore there.
    @Mapping(target = "parentCategory", ignore = true)
    Category toEntity(CategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parentCategory", ignore = true)
    void updateEntityFromRequest(CategoryRequest request, @MappingTarget Category category);

    @Mapping(target = "parentCategoryId", source = "parentCategory.id")
    @Mapping(target = "parentCategoryName", source = "parentCategory.name")
    CategoryResponse toResponse(Category category);

    CategoryDropdownResponse toDropdownResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

    List<CategoryDropdownResponse> toDropdownResponseList(List<Category> categories);
}