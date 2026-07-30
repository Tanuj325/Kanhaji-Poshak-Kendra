package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.address.AddressResponse;
import com.tanuj.krishanaposhak.dto.order.OrderResponse;
import com.tanuj.krishanaposhak.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
                OrderItemMapper.class
        }
)
public interface OrderMapper {

    @Mapping(target = "subTotal", expression = "java(order.getSubtotal() == null ? null : order.getSubtotal().doubleValue())")
    @Mapping(target = "discount", expression = "java(order.getDiscount() == null ? null : order.getDiscount().doubleValue())")
    @Mapping(target = "shippingCharge", expression = "java(order.getShippingCharge() == null ? null : order.getShippingCharge().doubleValue())")
    @Mapping(target = "totalAmount", expression = "java(order.getTotalAmount() == null ? null : order.getTotalAmount().doubleValue())")
    @Mapping(target = "orderDate", source = "createdAt")
    @Mapping(target = "items", source = "orderItems")
    @Mapping(target = "shippingAddress", expression = "java(buildShippingAddress(order))")
    OrderResponse toResponse(Order order);

    default AddressResponse buildShippingAddress(Order order) {
        if (order == null) return null;
        return AddressResponse.builder()
                .fullName(order.getCustomerName())
                .phoneNumber(order.getCustomerPhone())
                .addressLine1(order.getAddressLine1())
                .addressLine2(order.getAddressLine2())
                .city(order.getCity())
                .state(order.getState())
                .country(order.getCountry())
                .postalCode(order.getPostalCode())
                .build();
    }

}