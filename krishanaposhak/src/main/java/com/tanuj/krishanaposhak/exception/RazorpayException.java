package com.tanuj.krishanaposhak.exception;

public class RazorpayException extends BusinessException {

    public RazorpayException(String message) {
        super(message);
    }

    public RazorpayException(String message, Throwable cause) {
        super(message, cause);
    }
}