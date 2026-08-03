package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Refund;
import com.tanuj.krishanaposhak.enums.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {

    Refund findByRazorpayRefundId(String razorpayRefundId);

    Refund findByPaymentId(Long paymentId);

    Optional<Refund> findFirstByPaymentIdAndStatus(Long paymentId, RefundStatus status);

    boolean existsByPaymentIdAndStatus(Long paymentId, RefundStatus status);

    @Query("SELECT SUM(r.amount) FROM Refund r WHERE r.payment.id = ?1 AND r.status = 'PROCESSED'")
    Integer getTotalRefundedAmountByPaymentId(Long paymentId);

    java.util.List<Refund> findByStatus(RefundStatus status);

}