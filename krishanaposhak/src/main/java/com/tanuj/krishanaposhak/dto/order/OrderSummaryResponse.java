package com.tanuj.krishanaposhak.dto.order;

import com.tanuj.krishanaposhak.enums.OrderStatus;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {

    private Long id;

    private String orderNumber;

    private Double totalAmount;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private LocalDateTime orderDate;

}