package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByProductVariantId(Long productVariantId);

    long countByOrderId(Long orderId);

    void deleteByOrderId(Long orderId);

}