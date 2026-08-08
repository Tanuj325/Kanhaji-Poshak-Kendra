package com.tanuj.krishanaposhak.exception;

import lombok.Getter;

/**
 * Custom exception thrown during Razorpay webhook processing.
 * Carries a flag indicating whether the error is transient (e.g. database lock timeout)
 * or non-transient (e.g. missing metadata, amount mismatch).
 */
@Getter
public class WebhookProcessingException extends RuntimeException {

    private final boolean transientError;

    public WebhookProcessingException(String message, boolean transientError) {
        super(message);
        this.transientError = transientError;
    }

    public WebhookProcessingException(String message, Throwable cause, boolean transientError) {
        super(message, cause);
        this.transientError = transientError;
    }
}
