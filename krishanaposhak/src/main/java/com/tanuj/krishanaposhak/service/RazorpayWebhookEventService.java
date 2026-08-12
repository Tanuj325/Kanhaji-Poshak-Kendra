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
     * Checks whether a webhook event has already been accepted (exists in DB, any status).
     *
     * @param eventId the Razorpay webhook event ID
     * @return true if already accepted, false otherwise
     */
    boolean isAlreadyAccepted(String eventId);

    /**
     * Records a webhook event as accepted (RECEIVED status) in an isolated REQUIRES_NEW transaction.
     * Returns true if this is a genuinely new event, false if a duplicate was detected.
     *
     * @param eventId   the Razorpay webhook event ID
     * @param eventType the event type (e.g. payment.captured)
     * @return true if the event was newly recorded, false if it already existed
     */
    boolean recordEventAccepted(String eventId, String eventType);

    /**
     * Records a webhook event as processed in an isolated transaction (REQUIRES_NEW)
     * so that outer business transaction rollbacks do not erase the idempotency log.
     *
     * @param eventId   the Razorpay webhook event ID
     * @param eventType the event type (e.g. payment.captured)
     */
    void recordEventProcessed(String eventId, String eventType);

    /**
     * Marks a webhook event as FAILED with the given reason in an isolated REQUIRES_NEW transaction.
     *
     * @param eventId the Razorpay webhook event ID
     * @param reason  a short description of the failure
     */
    void markEventFailed(String eventId, String reason);
}

