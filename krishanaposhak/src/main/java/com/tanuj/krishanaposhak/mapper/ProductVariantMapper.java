package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.product.ProductVariantRequest;
import com.tanuj.krishanaposhak.dto.product.ProductVariantResponse;
import com.tanuj.krishanaposhak.entity.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/*
 * Note on type conversions:
 * - ProductVariant.size (String)  <-> ProductVariantRequest/Response.size (enums.Size)
 * - ProductVariant.price/discountPrice (BigDecimal) <-> Double on the DTOs
 * MapStruct handles both Enum<->String and BigDecimal<->Double conversions automatically
 * (built-in implicit type conversion), so no custom mapping methods are needed here.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductVariantMapper {

    // product is set manually in the service after the owning Product is loaded.
    // ProductVariant uses plain @Builder, so inherited BaseEntity fields like "id" aren't
    // builder properties at all — nothing to ignore there.
    @Mapping(target = "product", ignore = true)
    ProductVariant toEntity(ProductVariantRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    void updateEntityFromRequest(ProductVariantRequest request, @MappingTarget ProductVariant variant);

    ProductVariantResponse toResponse(ProductVariant variant);

    List<ProductVariantResponse> toResponseList(List<ProductVariant> variants);
}