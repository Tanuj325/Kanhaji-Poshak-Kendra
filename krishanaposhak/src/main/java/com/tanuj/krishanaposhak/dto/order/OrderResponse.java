package com.tanuj.krishanaposhak.dto.order;

import com.tanuj.krishanaposhak.dto.address.AddressResponse;
import com.tanuj.krishanaposhak.enums.OrderStatus;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;

    private String orderNumber;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private Double subTotal;

    private Double discount;

    private Double shippingCharge;

    private Double totalAmount;

    private String couponCode;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    private String notes;

    private String cancellationReason;

    private String cancelledBy;

    private AddressResponse shippingAddress;

    private LocalDateTime orderDate;

    private List<OrderItemResponse> items;

}