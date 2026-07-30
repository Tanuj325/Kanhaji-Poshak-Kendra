package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Payment;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    boolean existsByTransactionId(String transactionId);

    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);

    long countByPaymentStatus(PaymentStatus paymentStatus);

    /**
     * Get the N most recent payments ordered by creation date descending.
     *
     * @param n the number of recent payments to retrieve
     * @return list of recent payments
     */
    List<Payment> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}