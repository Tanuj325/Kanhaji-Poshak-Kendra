package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.product.ProductImageRequest;
import com.tanuj.krishanaposhak.dto.product.ProductImageResponse;
import com.tanuj.krishanaposhak.entity.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductImageMapper {

    // product is set manually in the service after the owning Product is loaded.
    // ProductImage uses plain @Builder, so inherited BaseEntity fields like "id" aren't
    // builder properties at all — nothing to ignore there.
    @Mapping(target = "product", ignore = true)
    ProductImage toEntity(ProductImageRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    void updateEntityFromRequest(ProductImageRequest request, @MappingTarget ProductImage image);

    ProductImageResponse toResponse(ProductImage image);

    List<ProductImageResponse> toResponseList(List<ProductImage> images);
}