package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.category.CategoryDropdownResponse;
import com.tanuj.krishanaposhak.dto.category.CategoryRequest;
import com.tanuj.krishanaposhak.dto.category.CategoryResponse;
import com.tanuj.krishanaposhak.entity.Category;
import com.tanuj.krishanaposhak.util.UrlUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    // parentCategory is resolved from parentCategoryId in the service layer, then set manually.
    // Image handling (Cloudinary) is managed by CategoryServiceImpl.
    @Mapping(target = "parentCategory", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    Category toEntity(CategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parentCategory", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    void updateEntityFromRequest(CategoryRequest request, @MappingTarget Category category);

    @Mapping(target = "parentCategoryId", source = "parentCategory.id")
    @Mapping(target = "parentCategoryName", source = "parentCategory.name")
    @Mapping(target = "imageUrl", expression = "java(com.tanuj.krishanaposhak.util.UrlUtils.ensureHttps(category.getImageUrl()))")
    CategoryResponse toResponse(Category category);

    CategoryDropdownResponse toDropdownResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

    List<CategoryDropdownResponse> toDropdownResponseList(List<Category> categories);
}