package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {

    Refund findByRazorpayRefundId(String razorpayRefundId);

    Refund findByPaymentId(Long paymentId);

    @Query("SELECT SUM(r.amount) FROM Refund r WHERE r.payment.id = ?1")
    Integer getTotalRefundedAmountByPaymentId(Long paymentId);

}