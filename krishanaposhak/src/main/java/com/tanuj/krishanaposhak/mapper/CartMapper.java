package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.cart.CartResponse;
import com.tanuj.krishanaposhak.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
                CartItemMapper.class
        }
)
public interface CartMapper {

    @Mapping(target = "items", source = "cartItems")
    @Mapping(target = "totalItems", ignore = true)
    @Mapping(target = "subTotal", ignore = true)
    @Mapping(target = "discount", ignore = true)
    @Mapping(target = "shippingCharge", ignore = true)
    @Mapping(target = "grandTotal", ignore = true)
    CartResponse toResponse(Cart cart);

}