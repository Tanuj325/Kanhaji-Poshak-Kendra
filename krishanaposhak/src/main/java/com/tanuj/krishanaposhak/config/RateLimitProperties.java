package com.tanuj.krishanaposhak.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    private boolean enabled = true;
    private boolean trustProxyHeaders = false;

    private Auth auth = new Auth();
    private PublicCategory publicCategory = new PublicCategory();
    private Authenticated authenticated = new Authenticated();
    private Admin admin = new Admin();
    private Sensitive sensitive = new Sensitive();

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isTrustProxyHeaders() {
        return trustProxyHeaders;
    }

    public void setTrustProxyHeaders(boolean trustProxyHeaders) {
        this.trustProxyHeaders = trustProxyHeaders;
    }

    public Auth getAuth() {
        return auth;
    }

    public void setAuth(Auth auth) {
        this.auth = auth;
    }

    public PublicCategory getPublicCategory() {
        return publicCategory;
    }

    public void setPublicCategory(PublicCategory publicCategory) {
        this.publicCategory = publicCategory;
    }

    public Authenticated getAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(Authenticated authenticated) {
        this.authenticated = authenticated;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public Sensitive getSensitive() {
        return sensitive;
    }

    public void setSensitive(Sensitive sensitive) {
        this.sensitive = sensitive;
    }

    public static class LimitConfig {
        private int capacity;
        private int refillTokens;
        private int refillDurationMinutes = 1;

        public LimitConfig() {}

        public LimitConfig(int capacity, int refillTokens, int refillDurationMinutes) {
            this.capacity = capacity;
            this.refillTokens = refillTokens;
            this.refillDurationMinutes = refillDurationMinutes;
        }

        public int getCapacity() {
            return capacity;
        }

        public void setCapacity(int capacity) {
            this.capacity = capacity;
        }

        public int getRefillTokens() {
            return refillTokens;
        }

        public void setRefillTokens(int refillTokens) {
            this.refillTokens = refillTokens;
        }

        public int getRefillDurationMinutes() {
            return refillDurationMinutes;
        }

        public void setRefillDurationMinutes(int refillDurationMinutes) {
            this.refillDurationMinutes = refillDurationMinutes;
        }
    }

    public static class Auth {
        private LimitConfig loginIp = new LimitConfig(5, 5, 1);
        private LimitConfig loginAccount = new LimitConfig(5, 5, 1);
        private LimitConfig registerIp = new LimitConfig(5, 5, 10);
        private LimitConfig registerAccount = new LimitConfig(5, 5, 10);
        private LimitConfig forgotPasswordIp = new LimitConfig(3, 3, 15);
        private LimitConfig forgotPasswordAccount = new LimitConfig(3, 3, 15);
        private LimitConfig resetPasswordIp = new LimitConfig(5, 5, 15);
        private LimitConfig verifyEmailIp = new LimitConfig(3, 3, 10);
        private LimitConfig resendVerificationIp = new LimitConfig(3, 3, 10);
        private LimitConfig resendVerificationAccount = new LimitConfig(3, 3, 10);
        private LimitConfig refreshTokenIp = new LimitConfig(10, 10, 1);

        private Backoff backoff = new Backoff();

        public LimitConfig getLoginIp() { return loginIp; }
        public void setLoginIp(LimitConfig loginIp) { this.loginIp = loginIp; }

        public LimitConfig getLoginAccount() { return loginAccount; }
        public void setLoginAccount(LimitConfig loginAccount) { this.loginAccount = loginAccount; }

        public LimitConfig getRegisterIp() { return registerIp; }
        public void setRegisterIp(LimitConfig registerIp) { this.registerIp = registerIp; }

        public LimitConfig getRegisterAccount() { return registerAccount; }
        public void setRegisterAccount(LimitConfig registerAccount) { this.registerAccount = registerAccount; }

        public LimitConfig getForgotPasswordIp() { return forgotPasswordIp; }
        public void setForgotPasswordIp(LimitConfig forgotPasswordIp) { this.forgotPasswordIp = forgotPasswordIp; }

        public LimitConfig getForgotPasswordAccount() { return forgotPasswordAccount; }
        public void setForgotPasswordAccount(LimitConfig forgotPasswordAccount) { this.forgotPasswordAccount = forgotPasswordAccount; }

        public LimitConfig getResetPasswordIp() { return resetPasswordIp; }
        public void setResetPasswordIp(LimitConfig resetPasswordIp) { this.resetPasswordIp = resetPasswordIp; }

        public LimitConfig getVerifyEmailIp() { return verifyEmailIp; }
        public void setVerifyEmailIp(LimitConfig verifyEmailIp) { this.verifyEmailIp = verifyEmailIp; }

        public LimitConfig getResendVerificationIp() { return resendVerificationIp; }
        public void setResendVerificationIp(LimitConfig resendVerificationIp) { this.resendVerificationIp = resendVerificationIp; }

        public LimitConfig getResendVerificationAccount() { return resendVerificationAccount; }
        public void setResendVerificationAccount(LimitConfig resendVerificationAccount) { this.resendVerificationAccount = resendVerificationAccount; }

        public LimitConfig getRefreshTokenIp() { return refreshTokenIp; }
        public void setRefreshTokenIp(LimitConfig refreshTokenIp) { this.refreshTokenIp = refreshTokenIp; }

        public Backoff getBackoff() { return backoff; }
        public void setBackoff(Backoff backoff) { this.backoff = backoff; }
    }

    public static class Backoff {
        private long initialDelaySeconds = 1;
        private double multiplier = 2.0;
        private long maxDelaySeconds = 300;
        private long resetAfterSeconds = 900;
        private int failureThreshold = 1;

        public long getInitialDelaySeconds() { return initialDelaySeconds; }
        public void setInitialDelaySeconds(long initialDelaySeconds) { this.initialDelaySeconds = initialDelaySeconds; }

        public double getMultiplier() { return multiplier; }
        public void setMultiplier(double multiplier) { this.multiplier = multiplier; }

        public long getMaxDelaySeconds() { return maxDelaySeconds; }
        public void setMaxDelaySeconds(long maxDelaySeconds) { this.maxDelaySeconds = maxDelaySeconds; }

        public long getResetAfterSeconds() { return resetAfterSeconds; }
        public void setResetAfterSeconds(long resetAfterSeconds) { this.resetAfterSeconds = resetAfterSeconds; }

        public int getFailureThreshold() { return failureThreshold; }
        public void setFailureThreshold(int failureThreshold) { this.failureThreshold = failureThreshold; }
    }

    public static class PublicCategory {
        private LimitConfig defaultLimit = new LimitConfig(60, 60, 1);

        public LimitConfig getDefaultLimit() { return defaultLimit; }
        public void setDefaultLimit(LimitConfig defaultLimit) { this.defaultLimit = defaultLimit; }
    }

    public static class Authenticated {
        private LimitConfig defaultLimit = new LimitConfig(120, 120, 1);

        public LimitConfig getDefaultLimit() { return defaultLimit; }
        public void setDefaultLimit(LimitConfig defaultLimit) { this.defaultLimit = defaultLimit; }
    }

    public static class Admin {
        private LimitConfig defaultLimit = new LimitConfig(300, 300, 1);

        public LimitConfig getDefaultLimit() { return defaultLimit; }
        public void setDefaultLimit(LimitConfig defaultLimit) { this.defaultLimit = defaultLimit; }
    }

    public static class Sensitive {
        private LimitConfig contact = new LimitConfig(10, 10, 10);
        private LimitConfig orderCreation = new LimitConfig(10, 10, 1);
        private LimitConfig reviewSubmission = new LimitConfig(10, 10, 10);
        private LimitConfig profileMutation = new LimitConfig(30, 30, 1);
        private LimitConfig notificationMutation = new LimitConfig(60, 60, 1);

        public LimitConfig getContact() { return contact; }
        public void setContact(LimitConfig contact) { this.contact = contact; }

        public LimitConfig getOrderCreation() { return orderCreation; }
        public void setOrderCreation(LimitConfig orderCreation) { this.orderCreation = orderCreation; }

        public LimitConfig getReviewSubmission() { return reviewSubmission; }
        public void setReviewSubmission(LimitConfig reviewSubmission) { this.reviewSubmission = reviewSubmission; }

        public LimitConfig getProfileMutation() { return profileMutation; }
        public void setProfileMutation(LimitConfig profileMutation) { this.profileMutation = profileMutation; }

        public LimitConfig getNotificationMutation() { return notificationMutation; }
        public void setNotificationMutation(LimitConfig notificationMutation) { this.notificationMutation = notificationMutation; }
    }
}
