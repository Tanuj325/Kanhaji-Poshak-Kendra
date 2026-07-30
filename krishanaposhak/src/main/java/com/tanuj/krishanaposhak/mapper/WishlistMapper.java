package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.wishlist.WishlistResponse;
import com.tanuj.krishanaposhak.entity.ProductImage;
import com.tanuj.krishanaposhak.entity.WishlistItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring")
public interface WishlistMapper {

    @Mapping(target = "wishlistId", source = "wishlist.id")
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "productName", source = "productVariant.product.name")
    @Mapping(target = "slug", source = "productVariant.product.slug")
    @Mapping(target = "imageUrl", source = ".", qualifiedByName = "imageUrl")
    @Mapping(target = "price",
            expression = "java(wishlistItem.getProductVariant().getPrice().doubleValue())")
    @Mapping(target = "discountPrice",
            expression = "java(wishlistItem.getProductVariant().getDiscountPrice() == null ? null : wishlistItem.getProductVariant().getDiscountPrice().doubleValue())")
    @Mapping(target = "inStock",
            expression = "java(wishlistItem.getProductVariant().getStock() > 0)")
    WishlistResponse toResponse(WishlistItem wishlistItem);

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
        return images.stream()
                .filter(img -> img != null && Boolean.TRUE.equals(img.getActive()) && Boolean.TRUE.equals(img.getThumbnail()))
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElseGet(() -> images.stream()
                        .filter(img -> img != null && Boolean.TRUE.equals(img.getActive()))
                        .findFirst()
                        .map(ProductImage::getImageUrl)
                        .orElseGet(() -> images.getFirst().getImageUrl()));
    }
}