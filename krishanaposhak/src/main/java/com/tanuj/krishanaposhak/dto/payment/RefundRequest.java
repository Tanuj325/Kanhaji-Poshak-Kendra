package com.tanuj.krishanaposhak.dto.payment;

import lombok.Data;

@Data
public class RefundRequest {

    private Long paymentId;
    private Integer amount; // in INR (will be converted to paise for API)
    private String reason;

}