package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.payment.AdminPaymentMonitoringResponse;
import com.tanuj.krishanaposhak.service.PaymentService;
import com.tanuj.krishanaposhak.service.RefundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@Tag(name = "Admin Payments", description = "Admin Payment Monitoring and Recovery Operations API")
@SecurityRequirement(name = "bearerScheme")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentService paymentService;
    private final RefundService refundService;

    @Operation(summary = "Get admin payment monitoring telemetry and paginated records")
    @GetMapping("/monitoring")
    public ResponseEntity<AdminPaymentMonitoringResponse> getPaymentMonitoringData(
            @Parameter(description = "Filter by status: ALL, PENDING, PAID, FAILED, REFUND_PENDING, REFUNDED")
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @Parameter(description = "Search term for order number, customer name, email, or transaction ID")
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        AdminPaymentMonitoringResponse response = paymentService.getAdminPaymentMonitoringData(status, search, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Trigger manual payment reconciliation job")
    @PostMapping("/reconcile")
    public ResponseEntity<String> triggerManualReconciliation() {
        int recovered = paymentService.reconcilePendingPayments();
        return ResponseEntity.ok("Reconciliation completed. Recovered " + recovered + " payment(s).");
    }

    @Operation(summary = "Trigger manual refund retry job")
    @PostMapping("/retry-refunds")
    public ResponseEntity<String> triggerManualRefundRetry() {
        int retried = refundService.retryFailedRefunds(5, 5);
        return ResponseEntity.ok("Refund retry completed. Successfully retried " + retried + " refund(s).");
    }

    @Operation(summary = "Trigger pending order cleanup job")
    @PostMapping("/cleanup-unpaid")
    public ResponseEntity<String> triggerManualCleanup() {
        int cancelled = paymentService.cleanupUnpaidPendingOrders();
        return ResponseEntity.ok("Cleanup completed. Cancelled " + cancelled + " expired unpaid order(s).");
    }
}
