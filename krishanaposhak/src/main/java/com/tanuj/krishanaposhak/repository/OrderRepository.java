package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Order;
import com.tanuj.krishanaposhak.enums.OrderStatus;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long>,
        JpaSpecificationExecutor<Order> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdWithLock(@Param("id") Long id);

    Optional<Order> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatus orderStatus);

    List<Order> findByPaymentStatusOrderByCreatedAtDesc(PaymentStatus paymentStatus);

    long countByOrderStatus(OrderStatus orderStatus);

    long countByUserId(Long userId);

    /**
     * Get the N most recent orders ordered by creation date descending.
     *
     * @param n the number of recent orders to retrieve
     * @return list of recent orders
     */
    List<Order> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);

    /**
     * Get sales data grouped by day for a date range.
     * Returns Object[]: [year, month, day, totalAmount, orderCount]
     */
    @Query("SELECT YEAR(o.createdAt) as year, MONTH(o.createdAt) as month, DAY(o.createdAt) as day, " +
           "SUM(o.totalAmount) as totalAmount, COUNT(o) as orderCount " +
           "FROM Order o " +
           "WHERE o.orderStatus = com.tanuj.krishanaposhak.enums.OrderStatus.DELIVERED " +
           "AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(o.createdAt), MONTH(o.createdAt), DAY(o.createdAt) " +
           "ORDER BY YEAR(o.createdAt), MONTH(o.createdAt), DAY(o.createdAt)")
    List<Object[]> findSalesDataByDay(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Get sales data grouped by week for a date range.
     * Returns Object[]: [year, week, totalAmount, orderCount]
     */
    @Query("SELECT YEAR(o.createdAt) as year, WEEK(o.createdAt) as week, " +
           "SUM(o.totalAmount) as totalAmount, COUNT(o) as orderCount " +
           "FROM Order o " +
           "WHERE o.orderStatus = com.tanuj.krishanaposhak.enums.OrderStatus.DELIVERED " +
           "AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(o.createdAt), WEEK(o.createdAt) " +
           "ORDER BY YEAR(o.createdAt), WEEK(o.createdAt)")
    List<Object[]> findSalesDataByWeek(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Get sales data grouped by month for a date range.
     * Returns Object[]: [year, month, totalAmount, orderCount]
     */
    @Query("SELECT YEAR(o.createdAt) as year, MONTH(o.createdAt) as month, " +
           "SUM(o.totalAmount) as totalAmount, COUNT(o) as orderCount " +
           "FROM Order o " +
           "WHERE o.orderStatus = com.tanuj.krishanaposhak.enums.OrderStatus.DELIVERED " +
           "AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
           "ORDER BY YEAR(o.createdAt), MONTH(o.createdAt)")
    List<Object[]> findSalesDataByMonth(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Get sales data grouped by year for a date range.
     * Returns Object[]: [year, totalAmount, orderCount]
     */
    @Query("SELECT YEAR(o.createdAt) as year, " +
           "SUM(o.totalAmount) as totalAmount, COUNT(o) as orderCount " +
           "FROM Order o " +
           "WHERE o.orderStatus = com.tanuj.krishanaposhak.enums.OrderStatus.DELIVERED " +
           "AND o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(o.createdAt) " +
           "ORDER BY YEAR(o.createdAt)")
    List<Object[]> findSalesDataByYear(LocalDateTime startDate, LocalDateTime endDate);
}