package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.cart.CartItemResponse;
import com.tanuj.krishanaposhak.entity.CartItem;
import com.tanuj.krishanaposhak.entity.ProductImage;
import com.tanuj.krishanaposhak.util.UrlUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "cartItemId", source = "id")
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "productName", source = "productVariant.product.name")
    @Mapping(target = "slug", source = "productVariant.product.slug")
    @Mapping(target = "imageUrl", source = ".", qualifiedByName = "imageUrl")
    @Mapping(target = "size", source = "productVariant.size")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "discountPrice", source = "productVariant.discountPrice")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "totalPrice", source = ".", qualifiedByName = "totalPrice")
    @Mapping(target = "stock", source = "productVariant.stock")
    CartItemResponse toResponse(CartItem cartItem);

    @Named("imageUrl")
    default String imageUrl(CartItem cartItem) {
        if (cartItem == null
                || cartItem.getProductVariant() == null
                || cartItem.getProductVariant().getProduct() == null
                || cartItem.getProductVariant().getProduct().getImages() == null
                || cartItem.getProductVariant().getProduct().getImages().isEmpty()) {
            return null;
        }

        List<ProductImage> images = cartItem.getProductVariant().getProduct().getImages();
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

    @Named("totalPrice")
    default Double totalPrice(CartItem cartItem) {

        BigDecimal unitPrice = cartItem.getProductVariant().getDiscountPrice() != null
                ? cartItem.getProductVariant().getDiscountPrice()
                : cartItem.getPrice();

        return unitPrice
                .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
                .doubleValue();
    }
}