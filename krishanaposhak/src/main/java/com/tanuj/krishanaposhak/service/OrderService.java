package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.dto.order.OrderResponse;
import com.tanuj.krishanaposhak.dto.order.OrderSummaryResponse;
import com.tanuj.krishanaposhak.dto.order.PlaceOrderRequest;
import com.tanuj.krishanaposhak.entity.Order;
import com.tanuj.krishanaposhak.enums.OrderStatus;
import com.tanuj.krishanaposhak.enums.PaymentStatus;

import java.util.List;

import com.tanuj.krishanaposhak.dto.order.CancelOrderRequest;

public interface OrderService {

    OrderResponse placeOrder(Long userId, PlaceOrderRequest request);

    OrderResponse getOrderById(Long userId, Long orderId);

    OrderResponse getOrderByOrderNumber(String orderNumber);

    PaginationResponse<OrderSummaryResponse> getOrdersByUser(Long userId, OrderStatus orderStatus, PaymentStatus paymentStatus, String sort, int page, int size);

    PaginationResponse<OrderResponse> getAllOrders(OrderStatus orderStatus, PaymentStatus paymentStatus, String sort, int page, int size);

    OrderResponse cancelOrder(Long userId, Long orderId, CancelOrderRequest request);

    OrderResponse updateOrderStatus(Long orderId, OrderStatus status, String reason);

    Order createPendingOrder(Long userId, PlaceOrderRequest request);

    Order createAndPersistPendingOrder(Long userId, PlaceOrderRequest request);
}