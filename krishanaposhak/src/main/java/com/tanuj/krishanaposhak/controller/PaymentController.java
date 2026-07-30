package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.payment.PaymentRequest;
import com.tanuj.krishanaposhak.dto.payment.PaymentResponse;
import com.tanuj.krishanaposhak.dto.payment.RazorpayOrderResponse;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import com.tanuj.krishanaposhak.service.OrderService;
import com.tanuj.krishanaposhak.service.PaymentService;
import com.tanuj.krishanaposhak.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment processing API")
@SecurityRequirement(name = "bearerScheme")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
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

    @Operation(summary = "Create Razorpay order for a given order ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Razorpay order created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RazorpayOrderResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Order does not belong to user"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @PostMapping("/razorpay/order/{orderId}")
    public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(
            @Parameter(description = "Order ID", required = true) @PathVariable Long orderId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        // Verify that the order belongs to the user
        orderService.getOrderById(userId, orderId); // Will throw if not found or not owned
        RazorpayOrderResponse response = paymentService.createRazorpayOrder(orderId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Initiate payment for an order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment initiated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid payment details"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Order does not belong to user"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiatePayment(
            @Valid @RequestBody PaymentRequest paymentRequest,
            HttpServletRequest httpRequest) {

        Long userId = getUserIdFromRequest(httpRequest);

        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // Verify that the order belongs to the user
        orderService.getOrderById(userId, paymentRequest.getOrderId());

        PaymentResponse response = paymentService.initiatePayment(userId, paymentRequest);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Verify Razorpay payment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment verified successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid payment signature"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Payment does not belong to user"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @PostMapping("/razorpay/verify")
    public ResponseEntity<PaymentResponse> verifyRazorpayPayment(
            HttpServletRequest request,
            @Parameter(description = "Razorpay order ID", required = true) @RequestParam String razorpayOrderId,
            @Parameter(description = "Razorpay payment ID", required = true) @RequestParam String razorpayPaymentId,
            @Parameter(description = "Razorpay signature", required = true) @RequestParam String razorpaySignature) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        PaymentResponse response = paymentService.verifyRazorpayPayment(
                userId, razorpayOrderId, razorpayPaymentId, razorpaySignature);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get payment by order ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Payment does not belong to user"),
            @ApiResponse(responseCode = "404", description = "Payment not found for order")
    })
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrder(
            @Parameter(description = "Order ID", required = true) @PathVariable Long orderId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        // Verify that the order belongs to the user
        orderService.getOrderById(userId, orderId); // Will throw if not found or not owned
        PaymentResponse response = paymentService.getPaymentByOrder(orderId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get payment by payment ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Payment does not belong to user"),
            @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @Parameter(description = "Payment ID", required = true) @PathVariable Long paymentId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        PaymentResponse paymentResponse = paymentService.getPaymentById(paymentId);
        // Verify that the payment's order belongs to the user
        orderService.getOrderById(userId, paymentResponse.getOrderId());
        return ResponseEntity.ok(paymentResponse);
    }

    @Operation(summary = "Update payment status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment status updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status value"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Payment does not belong to user"),
            @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    @PutMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @Parameter(description = "Payment ID", required = true) @PathVariable Long paymentId,
            @Parameter(description = "Payment status (e.g., PAID, FAILED)", required = true) @RequestParam String status, // Expecting PaymentStatus as string, e.g., "PAID"
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        // Verify that the payment belongs to the user by checking the order
        PaymentResponse paymentResponse = paymentService.getPaymentById(paymentId);
        orderService.getOrderById(userId, paymentResponse.getOrderId());
        // Convert string status to PaymentStatus enum
        PaymentStatus paymentStatus;
        try {
            paymentStatus = PaymentStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        PaymentResponse response = paymentService.updatePaymentStatus(paymentId, paymentStatus);
        return ResponseEntity.ok(response);
    }
}