package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.service.PaymentService;
import com.tanuj.krishanaposhak.service.RazorpayService;
import com.tanuj.krishanaposhak.service.RazorpayWebhookEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * Controller for handling Razorpay webhooks.
 * This endpoint is publicly accessible (no authentication required).
 *
 * <p>Uses an accept-then-process-async pattern:
 * <ol>
 *   <li>Validate signature (reject invalid requests with 400)</li>
 *   <li>Parse event metadata (reject malformed with 400)</li>
 *   <li>Check idempotency and record event as RECEIVED</li>
 *   <li>Return HTTP 200 immediately to Razorpay</li>
 *   <li>Process business logic asynchronously</li>
 * </ol>
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment/webhook")
@Tag(name = "Webhooks", description = "Webhook endpoints")
public class RazorpayWebhookController {

    private final RazorpayService razorpayService;
    private final PaymentService paymentService;
    private final RazorpayWebhookEventService razorpayWebhookEventService;

    @Operation(summary = "Handle Razorpay webhook events")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Webhook accepted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or signature")
    })
    @PostMapping("/razorpay")
    public ResponseEntity<Void> handleWebhook(
            @Parameter(description = "HTTP request containing the webhook payload in the body", required = true) HttpServletRequest request,
            @Parameter(description = "Razorpay signature header for webhook verification", required = true) @RequestHeader(value = "X-Razorpay-Signature", required = false) String razorpaySignature) {

        long startTime = System.currentTimeMillis();
        log.info("[WEBHOOK_RECEIVED] Razorpay webhook POST request received");

        // ── 1. Validate signature header ──
        if (razorpaySignature == null || razorpaySignature.isBlank()) {
            log.warn("[WEBHOOK_REJECTED] Missing X-Razorpay-Signature header. Status: 400");
            return ResponseEntity.badRequest().build();
        }

        // ── 2. Read request body ──
        StringBuilder payloadBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                payloadBuilder.append(line);
            }
        } catch (Exception e) {
            log.error("[WEBHOOK_REJECTED] Failed to read request body. Status: 400", e);
            return ResponseEntity.badRequest().build();
        }
        String payload = payloadBuilder.toString();

        // ── 3. Verify signature ──
        boolean isValidSignature;
        try {
            isValidSignature = razorpayService.verifyWebhookSignature(payload, razorpaySignature);
        } catch (Exception e) {
            log.warn("[WEBHOOK_REJECTED] Signature verification error: {}. Status: 400", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
        if (!isValidSignature) {
            log.warn("[WEBHOOK_REJECTED] Signature verification failed. Status: 400");
            return ResponseEntity.badRequest().build();
        }
        log.info("[WEBHOOK_SIGNATURE_VALID] Razorpay webhook signature verified successfully");

        // ── 4. Parse event metadata ──
        String eventId;
        String eventType;
        try {
            org.json.JSONObject json = new org.json.JSONObject(payload);
            eventId = json.optString("id", null);
            eventType = json.optString("event", null);

            // Extract payment/order IDs for logging only
            String razorpayPaymentId = null;
            String razorpayOrderId = null;
            if (json.has("payload") && !json.isNull("payload")) {
                org.json.JSONObject payloadObj = json.optJSONObject("payload");
                if (payloadObj != null && payloadObj.has("payment") && !payloadObj.isNull("payment")) {
                    org.json.JSONObject paymentObj = payloadObj.optJSONObject("payment");
                    if (paymentObj != null && paymentObj.has("entity") && !paymentObj.isNull("entity")) {
                        org.json.JSONObject entity = paymentObj.optJSONObject("entity");
                        if (entity != null) {
                            razorpayPaymentId = entity.optString("id", null);
                            razorpayOrderId = entity.optString("order_id", null);
                        }
                    }
                }
            }
            log.info("[WEBHOOK_EVENT_PARSED] EventId: {}, EventType: {}, PaymentId: {}, OrderId: {}",
                    eventId, eventType, razorpayPaymentId, razorpayOrderId);
        } catch (Exception e) {
            log.error("[WEBHOOK_REJECTED] Failed to parse webhook payload. Status: 400", e);
            return ResponseEntity.badRequest().build();
        }

        if (eventId == null || eventType == null) {
            log.warn("[WEBHOOK_REJECTED] Missing event ID or type in payload. Status: 400");
            return ResponseEntity.badRequest().build();
        }

        // ── 5. Idempotency check — if already accepted/processed, return 200 immediately ──
        if (razorpayWebhookEventService.isAlreadyAccepted(eventId)) {
            long duration = System.currentTimeMillis() - startTime;
            log.info("[WEBHOOK_DUPLICATE] Event already accepted/processed. EventId: {}, Duration: {}ms. Status: 200",
                    eventId, duration);
            return ResponseEntity.ok().build();
        }

        // ── 6. Record event as RECEIVED (returns false if concurrent duplicate) ──
        boolean accepted = razorpayWebhookEventService.recordEventAccepted(eventId, eventType);

        // ── 7. Kick off async business processing only for genuinely new events ──
        if (accepted) {
            paymentService.processWebhookEventAsync(eventId, eventType, payload);
        }

        // ── 8. Return 200 immediately — Razorpay is acknowledged ──
        long duration = System.currentTimeMillis() - startTime;
        log.info("[WEBHOOK_ACCEPTED] EventId: {}, EventType: {}, Duration: {}ms. Status: 200",
                eventId, eventType, duration);
        return ResponseEntity.ok().build();
    }
}