package com.tanuj.krishanaposhak.dto.payment;

import lombok.Data;
import lombok.Builder;

@Builder
@Data
public class RefundResponse {

    private Long id;
    private String razorpayRefundId;
    private Integer amount; // in INR
    private String currency;
    private String status;
    private String reason;
    private Long paymentId;
    private Long orderId;

}