package com.tanuj.krishanaposhak.service;

import com.razorpay.RazorpayException;
import com.razorpay.RazorpayClient;
import com.razorpay.Refund;
import com.tanuj.krishanaposhak.dto.payment.CreateRazorpayOrderRequest;
import com.tanuj.krishanaposhak.dto.payment.CreateRazorpayOrderResponse;
import com.tanuj.krishanaposhak.dto.payment.PaymentVerificationRequest;
import org.json.JSONObject;

/**
 * Service for interacting with �� Razorpay �� API.
 */
public interface RazorpayService {

    /**
     * Creates a Razorpay order.
     *
     * @param request the request containing order details
     * @return the response containing Razorpay order details
     * @throws RazorpayException if the API call fails
     */
    CreateRazorpayOrderResponse createOrder(CreateRazorpayOrderRequest request) throws RazorpayException;

    /**
     * Verifies the payment signature.
     *
     * @param request the request containing payment details
     * @return true if the signature is valid, false otherwise
     * @throws RazorpayException if the verification fails due to an error
     */
    boolean verifyPayment(PaymentVerificationRequest request) throws RazorpayException;

    /**
     * Verifies the webhook signature.
     *
     * @param payload the request body as a string
     * @param signature the signature from the X-Razorpay-Signature header
     * @return true if the signature is valid, false otherwise
     * @throws RazorpayException if the verification fails due to an error
     */
    boolean verifyWebhookSignature(String payload, String signature) throws RazorpayException;

    /**
     * Creates a refund via Razorpay API.
     *
     * @param paymentId the Razorpay payment ID
     * @param options   the refund options (amount, etc.)
     * @return the refund object
     * @throws RazorpayException if the API call fails
     */
    Refund createRefund(String paymentId, JSONObject options) throws RazorpayException;

    /**
     * Fetches all payments associated with a Razorpay order ID.
     *
     * @param razorpayOrderId the Razorpay order ID
     * @return list of Razorpay Payment objects
     * @throws RazorpayException if the API call fails
     */
    java.util.List<com.razorpay.Payment> fetchPaymentsForOrder(String razorpayOrderId) throws RazorpayException;

    /**
     * Fetches a Razorpay Order by ID.
     *
     * @param razorpayOrderId the Razorpay order ID
     * @return the Razorpay Order object
     * @throws RazorpayException if the API call fails
     */
    com.razorpay.Order fetchOrder(String razorpayOrderId) throws RazorpayException;

    /**
     * Gets the Razorpay client instance.
     *
     * @return the Razorpay client
     */
    RazorpayClient getRazorpayClient();
}