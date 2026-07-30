package com.tanuj.krishanaposhak.dto.order;

import com.tanuj.krishanaposhak.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderSummaryResponse {

    private Long id;

    private String orderNumber;

    private Double totalAmount;

    private OrderStatus orderStatus;

    private LocalDateTime orderDate;

}