package com.tanuj.krishanaposhak.dto.payment;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long orderId;

    private String paymentMethod;

}