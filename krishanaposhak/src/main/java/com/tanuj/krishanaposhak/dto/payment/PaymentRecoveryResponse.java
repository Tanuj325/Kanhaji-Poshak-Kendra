package com.tanuj.krishanaposhak.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRecoveryResponse {

    private int recoveredCount;
    private int pendingCount;
    private int failedCount;
    private int refundPendingCount;
    private List<PaymentResponse> recoveredPayments;
    private List<PaymentResponse> pendingPayments;
    private String message;

}
