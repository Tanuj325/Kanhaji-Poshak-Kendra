package com.tanuj.krishanaposhak.entity;

import com.tanuj.krishanaposhak.common.BaseEntity;
import com.tanuj.krishanaposhak.enums.PaymentMethod;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "payments",
        indexes = {
                @Index(name = "idx_payment_order", columnList = "order_id"),
                @Index(name = "idx_payment_transaction", columnList = "transaction_id"),
                @Index(name = "idx_payment_razorpay_payment", columnList = "razorpay_payment_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_payment_order",
                        columnNames = "order_id")
        }
)
public class Payment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "transaction_id", length = 150)
    private String transactionId;

    @Column(name = "razorpay_order_id", length = 150)
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id", length = 150)
    private String razorpayPaymentId;

    @ToString.Exclude
    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(length = 500)
    private String remarks;

}