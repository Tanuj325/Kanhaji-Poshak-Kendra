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
            @Parameter(description = "Razorpay signature header for webhook verification", required = true) @RequestHeader("X-Razorpay-Signature") String razorpaySignature) {
        // Read the request body
        StringBuilder payloadBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                payloadBuilder.append(line);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        String payload = payloadBuilder.toString();

        // Verify the webhook signature
        boolean isValidSignature;
        try {
            isValidSignature = razorpayService.verifyWebhookSignature(payload, razorpaySignature);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        if (!isValidSignature) {
            return ResponseEntity.badRequest().build();
        }

        // Parse the payload to get event id and type
        try {
            // We assume the payload is a JSON string with at least "event" and "id" fields.
            // We'll use a simple JSON parsing for these two fields.
            // For simplicity, we use the same org.json library as in RazorpayService.
            org.json.JSONObject json = new org.json.JSONObject(payload);
            String eventId = json.optString("id", null);
            String eventType = json.optString("event", null);

            if (eventId == null || eventType == null) {
                return ResponseEntity.badRequest().build();
            }

            // Process the event
            paymentService.processWebhookEvent(eventId, eventType, payload);
        } catch (Exception e) {
            // If we cannot parse the payload or processing fails, we return 500 so that Razorpay retries
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok().build();
    }
}