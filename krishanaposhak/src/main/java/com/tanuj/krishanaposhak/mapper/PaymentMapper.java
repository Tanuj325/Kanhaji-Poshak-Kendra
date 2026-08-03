package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.payment.PaymentRequest;
import com.tanuj.krishanaposhak.dto.payment.PaymentResponse;
import com.tanuj.krishanaposhak.entity.Payment;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        builder = @Builder(disableBuilder = true)
)
public interface PaymentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "paymentStatus", ignore = true)
    @Mapping(target = "amount", ignore = true)
    @Mapping(target = "transactionId", ignore = true)
    @Mapping(target = "razorpayOrderId", ignore = true)
    @Mapping(target = "razorpayPaymentId", ignore = true)
    @Mapping(target = "razorpaySignature", ignore = true)
    @Mapping(target = "remarks", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    Payment toEntity(PaymentRequest request);

    @Mapping(target = "paymentId", source = "id")
    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "amount",
            expression = "java(payment.getAmount() == null ? null : payment.getAmount().doubleValue())")
    @Mapping(target = "refunded", ignore = true)
    @Mapping(target = "refundInitiated", ignore = true)
    @Mapping(target = "refundStatus", ignore = true)
    @Mapping(target = "message", ignore = true)
    PaymentResponse toResponse(Payment payment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "paymentStatus", ignore = true)
    @Mapping(target = "amount", ignore = true)
    @Mapping(target = "transactionId", ignore = true)
    @Mapping(target = "razorpayOrderId", ignore = true)
    @Mapping(target = "razorpayPaymentId", ignore = true)
    @Mapping(target = "razorpaySignature", ignore = true)
    @Mapping(target = "remarks", ignore = true)
    @Mapping(target = "paidAt", ignore = true)
    void updateEntity(PaymentRequest request,
                      @MappingTarget Payment payment);

}