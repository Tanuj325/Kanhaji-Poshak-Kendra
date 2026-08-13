package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.product.ProductCardResponse;
import com.tanuj.krishanaposhak.dto.product.ProductDetailsResponse;
import com.tanuj.krishanaposhak.dto.product.ProductRequest;
import com.tanuj.krishanaposhak.dto.product.ProductResponse;
import com.tanuj.krishanaposhak.entity.Product;
import com.tanuj.krishanaposhak.entity.ProductImage;
import com.tanuj.krishanaposhak.entity.ProductVariant;
import com.tanuj.krishanaposhak.util.UrlUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {ProductVariantMapper.class, ProductImageMapper.class}
)
public interface ProductMapper {

    // category is resolved from categoryId in the service layer, then set manually.
    // variants/images are added via their own mappers/endpoints, not on product creation.
    // Product uses plain @Builder, so inherited BaseEntity fields like "id" aren't builder
    // properties at all — nothing to ignore there.
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "images", ignore = true)
    Product toEntity(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updateEntityFromRequest(ProductRequest request, @MappingTarget Product product);

    // variants/images are picked up automatically by MapStruct via
    // ProductVariantMapper#toResponseList / ProductImageMapper#toResponseList (matching field names).
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ProductResponse toResponse(Product product);

    @Mapping(target = "category", source = "category.name")
    ProductDetailsResponse toDetailsResponse(Product product);

    List<ProductResponse> toResponseList(List<Product> products);

    // ProductCardResponse flattens a single price/discountPrice/size from the product's
    // variant list, which isn't a declarative field mapping, so it's handwritten.
    default ProductCardResponse toCardResponse(Product product) {
        if (product == null) {
            return null;
        }
        ProductVariant variant = pickDisplayVariant(product.getVariants());
        String thumbnailUrl = pickThumbnailUrl(product.getImages());

        ProductCardResponse.ProductCardResponseBuilder builder = ProductCardResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .imageUrl(thumbnailUrl)
                .featured(Boolean.TRUE.equals(product.getFeatured()))
                .newArrival(Boolean.TRUE.equals(product.getNewArrival()))
                .color(product.getColor());

        if (variant != null) {
            builder.variantId(variant.getId())
                    .price(variant.getPrice() != null ? variant.getPrice().doubleValue() : null)
                    .discountPrice(variant.getDiscountPrice() != null ? variant.getDiscountPrice().doubleValue() : null)
                    .size(variant.getSize());
        }

        return builder.build();
    }

    default List<ProductCardResponse> toCardResponseList(List<Product> products) {
        if (products == null) {
            return Collections.emptyList();
        }
        return products.stream()
                .map(this::toCardResponse)
                .toList();
    }

    private ProductVariant pickDisplayVariant(List<ProductVariant> variants) {
        if (variants == null || variants.isEmpty()) {
            return null;
        }
        return variants.stream()
                .filter(v -> Boolean.TRUE.equals(v.getActive()))
                .min(Comparator.comparing(v -> {
                    BigDecimal eff = (v.getDiscountPrice() != null && v.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                            ? v.getDiscountPrice()
                            : v.getPrice();
                    return eff != null ? eff : BigDecimal.valueOf(Double.MAX_VALUE);
                }))
                .orElse(variants.getFirst());
    }

    private String pickThumbnailUrl(List<ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        String url = images.stream()
                .filter(img -> Boolean.TRUE.equals(img.getThumbnail()))
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(images.getFirst().getImageUrl());
        return UrlUtils.ensureHttps(url);
    }
}