package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.order.OrderItemResponse;
import com.tanuj.krishanaposhak.entity.OrderItem;
import com.tanuj.krishanaposhak.util.UrlUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "productName", source = "productName")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "imageUrl", expression = "java(com.tanuj.krishanaposhak.util.UrlUtils.ensureHttps(orderItem.getProductImage()))")
    @Mapping(target = "size", source = "size")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "price",
            expression = "java(orderItem.getPrice() == null ? null : orderItem.getPrice().doubleValue())")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "totalPrice",
            expression = "java(orderItem.getTotalPrice() == null ? null : orderItem.getTotalPrice().doubleValue())")
    OrderItemResponse toResponse(OrderItem orderItem);

}