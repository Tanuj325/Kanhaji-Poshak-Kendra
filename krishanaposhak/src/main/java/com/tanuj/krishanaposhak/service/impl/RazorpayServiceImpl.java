package com.tanuj.krishanaposhak.service.impl;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import com.tanuj.krishanaposhak.dto.payment.CreateRazorpayOrderRequest;
import com.tanuj.krishanaposhak.dto.payment.CreateRazorpayOrderResponse;
import com.tanuj.krishanaposhak.dto.payment.PaymentVerificationRequest;
import com.tanuj.krishanaposhak.service.RazorpayService;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.ToString;

@Data
@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.api.key}")
    private String razorpayKeyId;

    @Value("${razorpay.api.secret}")
    @ToString.Exclude
    private String razorpayKeySecret;

    @Value("${razorpay.webhook-secret}")
    @ToString.Exclude
    private String razorpayWebhookSecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() throws RazorpayException {
        if (razorpayKeyId == null || razorpayKeySecret == null) {
            throw new IllegalStateException("Razorpay key credentials are not configured.");
        }
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    /**
     * Creates a Razorpay order.
     *
     * @param request the request containing order details
     * @return the response containing Razorpay order details
     * @throws RazorpayException if the API call fails
     */
    public CreateRazorpayOrderResponse createOrder(CreateRazorpayOrderRequest request) throws RazorpayException {
        // Validate request
        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (request.getCurrency() == null || request.getCurrency().isBlank()) {
            throw new IllegalArgumentException("Currency is required");
        }
        if (request.getReceipt() == null || request.getReceipt().isBlank()) {
            throw new IllegalArgumentException("Receipt is required");
        }

        JSONObject options = new JSONObject();
        options.put("amount", request.getAmount());
        options.put("currency", request.getCurrency());
        options.put("receipt", request.getReceipt());

        // Add notes if provided
        if (request.getNotes() != null && !request.getNotes().isEmpty()) {
            options.put("notes", new JSONObject(request.getNotes()));
        }

        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);

        return CreateRazorpayOrderResponse.builder()
                .id(razorpayOrder.get("id"))
                .currency(razorpayOrder.get("currency"))
                .amount(razorpayOrder.get("amount"))
                .key(razorpayKeyId)
                .build();
    }

    /**
     * Verifies the payment signature.
     *
     * @param request the request containing payment details
     * @return true if the signature is valid, false otherwise
     * @throws RazorpayException if the verification fails due to an error
     */
    public boolean verifyPayment(PaymentVerificationRequest request) throws RazorpayException {
        // Validate request
        if (request.getRazorpayOrderId() == null || request.getRazorpayOrderId().isBlank()) {
            throw new IllegalArgumentException("Razorpay order ID is required");
        }
        if (request.getRazorpayPaymentId() == null || request.getRazorpayPaymentId().isBlank()) {
            throw new IllegalArgumentException("Razorpay payment ID is required");
        }
        if (request.getRazorpaySignature() == null || request.getRazorpaySignature().isBlank()) {
            throw new IllegalArgumentException("Razorpay signature is required");
        }

        // Prepare attributes for verification
        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", request.getRazorpayOrderId());
        attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
        attributes.put("razorpay_signature", request.getRazorpaySignature());

        // Verify signature
        return com.razorpay.Utils.verifyPaymentSignature(attributes, razorpayKeySecret);
    }

    /**
     * Verifies the webhook signature.
     *
     * @param payload the request body as a string
     * @param signature the signature from the X-Razorpay-Signature header
     * @return true if the signature is valid, false otherwise
     * @throws RazorpayException if the verification fails due to an error
     */
    public boolean verifyWebhookSignature(String payload, String signature) throws RazorpayException {
        if (payload == null || payload.isBlank()) {
            throw new IllegalArgumentException("Payload is required");
        }
        if (signature == null || signature.isBlank()) {
            throw new IllegalArgumentException("Signature is required");
        }
        return com.razorpay.Utils.verifyWebhookSignature(payload, signature, razorpayWebhookSecret);
    }

    /**
     * Creates a refund via Razorpay API.
     *
     * @param paymentId the Razorpay payment ID
     * @param options   the refund options (amount, etc.)
     * @return the refund object
     * @throws RazorpayException if the API call fails
     */
    public Refund createRefund(String paymentId, JSONObject options) throws RazorpayException {
        options.put("payment_id", paymentId);
        return razorpayClient.refunds.create(options);
    }

    /**
     * Fetches all payments associated with a Razorpay order ID.
     *
     * @param razorpayOrderId the Razorpay order ID
     * @return list of Razorpay Payment objects
     * @throws RazorpayException if the API call fails
     */
    public java.util.List<com.razorpay.Payment> fetchPaymentsForOrder(String razorpayOrderId) throws RazorpayException {
        if (razorpayOrderId == null || razorpayOrderId.isBlank()) {
            throw new IllegalArgumentException("Razorpay order ID is required");
        }
        return razorpayClient.orders.fetchPayments(razorpayOrderId);
    }
}