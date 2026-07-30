package com.tanuj.krishanaposhak.dto.payment;

import com.tanuj.krishanaposhak.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long paymentId;

    private Long orderId;

    private String transactionId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private PaymentStatus paymentStatus;

    private Double amount;

}