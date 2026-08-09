package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.wishlist.WishlistItemResponse;
import com.tanuj.krishanaposhak.entity.ProductImage;
import com.tanuj.krishanaposhak.entity.WishlistItem;
import com.tanuj.krishanaposhak.util.UrlUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WishlistItemMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "productName", source = "productVariant.product.name")
    @Mapping(target = "slug", source = "productVariant.product.slug")
    @Mapping(target = "imageUrl", source = ".", qualifiedByName = "imageUrl")
    @Mapping(target = "price",
            expression = "java(wishlistItem.getProductVariant().getPrice().doubleValue())")
    @Mapping(target = "discountPrice",
            expression = "java(wishlistItem.getProductVariant().getDiscountPrice() == null ? null : wishlistItem.getProductVariant().getDiscountPrice().doubleValue())")
    @Mapping(target = "featured", source = "productVariant.product.featured")
    @Mapping(target = "newArrival", source = "productVariant.product.newArrival")
    WishlistItemResponse toResponse(WishlistItem wishlistItem);

    @Named("imageUrl")
    default String imageUrl(WishlistItem wishlistItem) {
        if (wishlistItem == null
                || wishlistItem.getProductVariant() == null
                || wishlistItem.getProductVariant().getProduct() == null
                || wishlistItem.getProductVariant().getProduct().getImages() == null
                || wishlistItem.getProductVariant().getProduct().getImages().isEmpty()) {
            return null;
        }

        List<ProductImage> images = wishlistItem.getProductVariant().getProduct().getImages();
        String rawUrl = images.stream()
                .filter(img -> img != null && Boolean.TRUE.equals(img.getActive()) && Boolean.TRUE.equals(img.getThumbnail()))
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElseGet(() -> images.stream()
                        .filter(img -> img != null && Boolean.TRUE.equals(img.getActive()))
                        .findFirst()
                        .map(ProductImage::getImageUrl)
                        .orElseGet(() -> images.getFirst().getImageUrl()));
        return UrlUtils.ensureHttps(rawUrl);
    }

}