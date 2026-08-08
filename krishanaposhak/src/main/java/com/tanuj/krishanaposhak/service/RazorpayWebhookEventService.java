package com.tanuj.krishanaposhak.service;

/**
 * Service for logging and querying Razorpay webhook event idempotency records.
 */
public interface RazorpayWebhookEventService {

    /**
     * Checks whether a webhook event has already been successfully processed.
     *
     * @param eventId the Razorpay webhook event ID
     * @return true if already processed, false otherwise
     */
    boolean isAlreadyProcessed(String eventId);

    /**
     * Records a webhook event as processed in an isolated transaction (REQUIRES_NEW)
     * so that outer business transaction rollbacks do not erase the idempotency log.
     *
     * @param eventId   the Razorpay webhook event ID
     * @param eventType the event type (e.g. payment.captured)
     */
    void recordEventProcessed(String eventId, String eventType);
}
