package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.dto.order.OrderResponse;
import com.tanuj.krishanaposhak.dto.order.OrderSummaryResponse;
import com.tanuj.krishanaposhak.dto.order.PlaceOrderRequest;
import com.tanuj.krishanaposhak.dto.payment.CreateRazorpayOrderRequest;
import com.tanuj.krishanaposhak.dto.payment.CreateRazorpayOrderResponse;
import com.tanuj.krishanaposhak.entity.Order;
import com.tanuj.krishanaposhak.entity.Payment;
import com.tanuj.krishanaposhak.enums.OrderStatus;
import com.tanuj.krishanaposhak.enums.PaymentMethod;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import com.tanuj.krishanaposhak.repository.OrderRepository;
import com.tanuj.krishanaposhak.repository.PaymentRepository;
import com.tanuj.krishanaposhak.service.OrderService;
import com.tanuj.krishanaposhak.service.RazorpayService;
import com.tanuj.krishanaposhak.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management API")
@SecurityRequirement(name = "bearerScheme")
public class OrderController {

    private final OrderService orderService;
    private final RazorpayService razorpayService;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final JwtService jwtService;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return null;
        }
        return jwtService.extractUserId(token);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Operation(summary = "Place a new order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Order placed successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody PlaceOrderRequest placeOrderRequest,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        OrderResponse response = orderService.placeOrder(userId, placeOrderRequest);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Create Razorpay order from cart (for payment)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Razorpay order created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CreateRazorpayOrderResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Payment gateway error")
    })
    @PostMapping("/razorpay")
    public ResponseEntity<CreateRazorpayOrderResponse> createRazorpayOrderFromCart(
            @Valid @RequestBody PlaceOrderRequest placeOrderRequest,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        if (placeOrderRequest.getPaymentMethod() != null && "COD".equalsIgnoreCase(placeOrderRequest.getPaymentMethod().trim())) {
            log.warn("[COD] Attempted to create Razorpay online order for COD request. Rejecting.");
            throw new com.tanuj.krishanaposhak.exception.BadRequestException(
                    "Cannot create Razorpay online payment order for Cash on Delivery (COD) payment method."
            );
        }

        // Build pending order object to validate cart/address/coupon/stock and calculate totals (DO NOT SAVE TO DB YET)
        Order order = orderService.createPendingOrder(userId, placeOrderRequest);

        // Prepare Razorpay order request with notes for server-side reconciliation resilience
        CreateRazorpayOrderRequest razorpayRequest = new CreateRazorpayOrderRequest();
        razorpayRequest.setAmount(order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue()); // Convert to paise
        razorpayRequest.setCurrency("INR");
        razorpayRequest.setReceipt("RCPT_" + System.currentTimeMillis());

        java.util.Map<String, String> notes = new java.util.HashMap<>();
        notes.put("userId", String.valueOf(userId));
        notes.put("shippingAddressId", String.valueOf(placeOrderRequest.getShippingAddressId()));
        if (placeOrderRequest.getCouponCode() != null) {
            notes.put("couponCode", placeOrderRequest.getCouponCode());
        }
        if (placeOrderRequest.getOrderNotes() != null) {
            notes.put("orderNotes", placeOrderRequest.getOrderNotes());
        }
        if (Boolean.TRUE.equals(placeOrderRequest.getIsBuyNow())) {
            notes.put("isBuyNow", "true");
            if (placeOrderRequest.getVariantId() != null) notes.put("variantId", String.valueOf(placeOrderRequest.getVariantId()));
            if (placeOrderRequest.getQuantity() != null) notes.put("quantity", String.valueOf(placeOrderRequest.getQuantity()));
            if (placeOrderRequest.getColor() != null) notes.put("color", placeOrderRequest.getColor());
        }
        razorpayRequest.setNotes(notes);

        try {
            CreateRazorpayOrderResponse response = razorpayService.createOrder(razorpayRequest);
            return ResponseEntity.ok(response);
        } catch (com.razorpay.RazorpayException e) {
            throw new com.tanuj.krishanaposhak.exception.RazorpayException(
                    "Failed to create Razorpay order",
                    e
            );
        }
    }

    @Operation(summary = "Get order by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        OrderResponse response = orderService.getOrderById(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get order by order number")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByOrderNumber(@PathVariable String orderNumber, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        // Note: getOrderByOrderNumber does not take userId, but we still require authentication.
        OrderResponse response = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get user's orders with filtering and pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<PaginationResponse<OrderSummaryResponse>> getOrdersByUser(
            @Parameter(description = "Filter by order status") @RequestParam(required = false) OrderStatus orderStatus,
            @Parameter(description = "Filter by payment status") @RequestParam(required = false) PaymentStatus paymentStatus,
            @Parameter(description = "Sort field and direction (e.g., 'createdAt,desc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        PaginationResponse<OrderSummaryResponse> response = orderService.getOrdersByUser(userId, orderStatus, paymentStatus, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cancel order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order cancelled successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "400", description = "Cannot cancel order"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        OrderResponse response = orderService.cancelOrder(userId, orderId);
        return ResponseEntity.ok(response);
    }

    // Admin endpoints
    @Operation(summary = "Get all orders with filtering and pagination (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaginationResponse<OrderResponse>> getAllOrders(
            @Parameter(description = "Filter by order status") @RequestParam(required = false) OrderStatus orderStatus,
            @Parameter(description = "Filter by payment status") @RequestParam(required = false) PaymentStatus paymentStatus,
            @Parameter(description = "Sort field and direction (e.g., 'createdAt,desc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        PaginationResponse<OrderResponse> response = orderService.getAllOrders(orderStatus, paymentStatus, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update order status (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order status updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status transition"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        OrderResponse response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(response);
    }
}