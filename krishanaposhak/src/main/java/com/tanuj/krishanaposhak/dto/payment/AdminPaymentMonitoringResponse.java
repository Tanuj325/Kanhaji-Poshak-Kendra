package com.tanuj.krishanaposhak.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPaymentMonitoringResponse {

    private long totalPayments;
    private long pendingPayments;
    private long capturedPayments;
    private long awaitingVerification;
    private long awaitingWebhook;
    private long webhookFailed;
    private long refundPending;
    private long refundFailed;
    private long recoveredPayments;

    private List<PaymentRecordDTO> records;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentRecordDTO {
        private Long paymentId;
        private Long orderId;
        private String orderNumber;
        private String customerName;
        private String customerEmail;
        private String paymentMethod;
        private String paymentStatus;
        private String orderStatus;
        private Double amount;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String refundStatus;
        private String refundId;
        private Integer retryCount;
        private Instant lastRetryAt;
        private String failureReason;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;
    }
}
