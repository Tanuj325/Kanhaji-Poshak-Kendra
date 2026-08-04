package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.service.PaymentService;
import com.tanuj.krishanaposhak.service.RazorpayService;
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
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment/webhook")
@Tag(name = "Webhooks", description = "Webhook endpoints")
public class RazorpayWebhookController {

    private final RazorpayService razorpayService;
    private final PaymentService paymentService;

    @Operation(summary = "Handle Razorpay webhook events")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Webhook processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or signature"),
            @ApiResponse(responseCode = "500", description = "Internal server error during processing")
    })
    @PostMapping("/razorpay")
    public ResponseEntity<Void> handleWebhook(
            @Parameter(description = "HTTP request containing the webhook payload in the body", required = true) HttpServletRequest request,
            @Parameter(description = "Razorpay signature header for webhook verification", required = true) @RequestHeader(value = "X-Razorpay-Signature", required = false) String razorpaySignature) {
        log.info("Razorpay webhook POST request received");

        if (razorpaySignature == null || razorpaySignature.isBlank()) {
            log.warn("Razorpay webhook request missing X-Razorpay-Signature header. Status: 400 Bad Request");
            return ResponseEntity.badRequest().build();
        }

        // Read the request body
        StringBuilder payloadBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                payloadBuilder.append(line);
            }
        } catch (Exception e) {
            log.error("Failed to read Razorpay webhook request body. Status: 400 Bad Request", e);
            return ResponseEntity.badRequest().build();
        }
        String payload = payloadBuilder.toString();

        // Verify the webhook signature
        boolean isValidSignature;
        try {
            isValidSignature = razorpayService.verifyWebhookSignature(payload, razorpaySignature);
        } catch (Exception e) {
            log.warn("Razorpay webhook signature verification error: {}. Status: 400 Bad Request", e.getMessage());
            return ResponseEntity.badRequest().build();
        }

        if (!isValidSignature) {
            log.warn("Razorpay webhook signature verification failed. Status: 400 Bad Request");
            return ResponseEntity.badRequest().build();
        }

        log.info("Razorpay webhook signature verification succeeded");

        // Parse the payload to extract event id, type, payment ID, and order ID for logging and processing
        try {
            org.json.JSONObject json = new org.json.JSONObject(payload);
            String eventId = json.optString("id", null);
            String eventType = json.optString("event", null);

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

            log.info("Processing Razorpay webhook event. EventId: {}, EventType: {}, PaymentId: {}, OrderId: {}",
                    eventId, eventType, razorpayPaymentId, razorpayOrderId);

            if (eventId == null || eventType == null) {
                log.warn("Razorpay webhook payload missing event ID or type. Status: 400 Bad Request");
                return ResponseEntity.badRequest().build();
            }

            // Process the event
            paymentService.processWebhookEvent(eventId, eventType, payload);
            log.info("Razorpay webhook event processed successfully. EventId: {}. Status: 200 OK", eventId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Internal error while processing Razorpay webhook event. Status: 500 Internal Server Error", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}