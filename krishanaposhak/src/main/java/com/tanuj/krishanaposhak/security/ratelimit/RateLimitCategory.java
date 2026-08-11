package com.tanuj.krishanaposhak.security.ratelimit;

public enum RateLimitCategory {
    AUTH_LOGIN,
    AUTH_REGISTER,
    AUTH_FORGOT_PASSWORD,
    AUTH_RESET_PASSWORD,
    AUTH_VERIFY_EMAIL,
    AUTH_RESEND_VERIFICATION,
    AUTH_REFRESH_TOKEN,
    SENSITIVE_PUBLIC,
    PUBLIC,
    SENSITIVE_USER_ACTION,
    AUTHENTICATED,
    ADMIN
}
