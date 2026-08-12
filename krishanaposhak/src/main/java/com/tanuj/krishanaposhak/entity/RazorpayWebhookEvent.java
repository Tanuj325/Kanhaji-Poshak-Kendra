package com.tanuj.krishanaposhak.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(
        name = "razorpay_webhook_events",
        indexes = {
                @Index(name = "idx_webhook_event_id", columnList = "event_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_webhook_event_id",
                        columnNames = "event_id")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayWebhookEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false, length = 100)
    private String eventId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "received_at")
    private Instant receivedAt;

    @Column(name = "processed_at")
    private Instant processedAt;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "RECEIVED";

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

}