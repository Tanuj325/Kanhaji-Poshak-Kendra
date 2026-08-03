package com.tanuj.krishanaposhak.entity;

import com.tanuj.krishanaposhak.enums.RefundStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(
        name = "refunds",
        indexes = {
                @Index(name = "idx_refund_payment", columnList = "payment_id"),
                @Index(name = "idx_refund_order", columnList = "order_id"),
                @Index(name = "idx_refund_razorpay_id", columnList = "razorpay_refund_id")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "razorpay_refund_id", length = 100)
    private String razorpayRefundId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "refund_amount", nullable = false)
    private Integer amount; // in paise

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RefundStatus status;

    @Column(length = 500)
    private String reason;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Builder.Default
    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "last_retry_at")
    private Instant lastRetryAt;

    @Column(name = "created_at")
    private Instant createdAt;

}