package com.tanuj.krishanaposhak.security.ratelimit;

import com.tanuj.krishanaposhak.config.RateLimitProperties;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class RateLimiterService {

    private static final Logger log = LoggerFactory.getLogger(RateLimiterService.class);

    private final RateLimitProperties rateLimitProperties;

    private final Map<String, BucketEntry> bucketMap = new ConcurrentHashMap<>();
    private final Map<String, AccountBackoffState> backoffMap = new ConcurrentHashMap<>();

    private static final long INACTIVE_BUCKET_TTL_MS = TimeUnit.MINUTES.toMillis(30);

    public RateLimiterService(RateLimitProperties rateLimitProperties) {
        this.rateLimitProperties = rateLimitProperties;
    }

    private static class BucketEntry {
        private final Bucket bucket;
        private volatile long lastAccessTimestamp;

        public BucketEntry(Bucket bucket, long lastAccessTimestamp) {
            this.bucket = bucket;
            this.lastAccessTimestamp = lastAccessTimestamp;
        }

        public Bucket getBucket() {
            return bucket;
        }

        public long getLastAccessTimestamp() {
            return lastAccessTimestamp;
        }

        public void setLastAccessTimestamp(long lastAccessTimestamp) {
            this.lastAccessTimestamp = lastAccessTimestamp;
        }
    }

    private static class AccountBackoffState {
        private int failedAttempts = 0;
        private long backoffUntilMs = 0;
        private long lastFailureMs = System.currentTimeMillis();

        public int getFailedAttempts() {
            return failedAttempts;
        }

        public void setFailedAttempts(int failedAttempts) {
            this.failedAttempts = failedAttempts;
        }

        public long getBackoffUntilMs() {
            return backoffUntilMs;
        }

        public void setBackoffUntilMs(long backoffUntilMs) {
            this.backoffUntilMs = backoffUntilMs;
        }

        public long getLastFailureMs() {
            return lastFailureMs;
        }

        public void setLastFailureMs(long lastFailureMs) {
            this.lastFailureMs = lastFailureMs;
        }
    }

    public static class RateLimitResult {
        private final boolean allowed;
        private final long retryAfterSeconds;

        public RateLimitResult(boolean allowed, long retryAfterSeconds) {
            this.allowed = allowed;
            this.retryAfterSeconds = retryAfterSeconds;
        }

        public boolean isAllowed() {
            return allowed;
        }

        public long getRetryAfterSeconds() {
            return retryAfterSeconds;
        }

        public static RateLimitResult allow() {
            return new RateLimitResult(true, 0);
        }

        public static RateLimitResult deny(long retryAfterSeconds) {
            return new RateLimitResult(false, Math.max(1, retryAfterSeconds));
        }
    }

    /**
     * Checks if rate limit is allowed for a given key and configuration.
     */
    public RateLimitResult tryConsume(String key, RateLimitProperties.LimitConfig limitConfig) {
        if (!rateLimitProperties.isEnabled() || limitConfig == null || limitConfig.getCapacity() <= 0) {
            return RateLimitResult.allow();
        }

        long now = System.currentTimeMillis();
        BucketEntry entry = bucketMap.compute(key, (k, existing) -> {
            if (existing == null) {
                Bucket bucket = createBucket(limitConfig);
                return new BucketEntry(bucket, now);
            }
            existing.setLastAccessTimestamp(now);
            return existing;
        });

        ConsumptionProbe probe = entry.getBucket().tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            return RateLimitResult.allow();
        }

        long waitSeconds = TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill()) + 1;
        return RateLimitResult.deny(waitSeconds);
    }

    /**
     * Checks if account backoff is currently active.
     */
    public long getRemainingAccountBackoffSeconds(String normalizedAccount) {
        if (normalizedAccount == null || normalizedAccount.isBlank()) {
            return 0;
        }

        AccountBackoffState state = backoffMap.get(normalizedAccount.toLowerCase().trim());
        if (state == null) {
            return 0;
        }

        long now = System.currentTimeMillis();
        if (state.getBackoffUntilMs() > now) {
            return TimeUnit.MILLISECONDS.toSeconds(state.getBackoffUntilMs() - now) + 1;
        }

        return 0;
    }

    /**
     * Records a failed login attempt and calculates exponential backoff.
     */
    public long recordLoginFailure(String normalizedAccount) {
        if (normalizedAccount == null || normalizedAccount.isBlank()) {
            return 0;
        }

        String key = normalizedAccount.toLowerCase().trim();
        RateLimitProperties.Backoff backoffConfig = rateLimitProperties.getAuth().getBackoff();
        long now = System.currentTimeMillis();

        AccountBackoffState state = backoffMap.computeIfAbsent(key, k -> new AccountBackoffState());
        state.setFailedAttempts(state.getFailedAttempts() + 1);
        state.setLastFailureMs(now);

        if (state.getFailedAttempts() >= backoffConfig.getFailureThreshold()) {
            int exponent = state.getFailedAttempts() - backoffConfig.getFailureThreshold();
            long delaySec = (long) (backoffConfig.getInitialDelaySeconds() * Math.pow(backoffConfig.getMultiplier(), exponent));
            delaySec = Math.min(delaySec, backoffConfig.getMaxDelaySeconds());

            long backoffUntilMs = now + (delaySec * 1000);
            state.setBackoffUntilMs(backoffUntilMs);
            log.warn("Account {} failure #{} -> exponential backoff for {}s", key, state.getFailedAttempts(), delaySec);
            return delaySec;
        }

        return 0;
    }

    /**
     * Clears failed attempt counter & backoff state on successful login.
     */
    public void recordLoginSuccess(String normalizedAccount) {
        if (normalizedAccount == null || normalizedAccount.isBlank()) {
            return;
        }

        String key = normalizedAccount.toLowerCase().trim();
        if (backoffMap.remove(key) != null) {
            log.info("Cleared login backoff state for account {}", key);
        }
    }

    /**
     * Extracts client IP address safely considering proxy config.
     */
    public String getClientIp(HttpServletRequest request) {
        if (rateLimitProperties.isTrustProxyHeaders()) {
            String forwardedFor = request.getHeader("X-Forwarded-For");
            if (forwardedFor != null && !forwardedFor.isBlank() && !"unknown".equalsIgnoreCase(forwardedFor)) {
                return forwardedFor.split(",")[0].trim();
            }

            String realIp = request.getHeader("X-Real-IP");
            if (realIp != null && !realIp.isBlank() && !"unknown".equalsIgnoreCase(realIp)) {
                return realIp.trim();
            }
        }

        return request.getRemoteAddr();
    }

    private Bucket createBucket(RateLimitProperties.LimitConfig config) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(config.getCapacity())
                .refillGreedy(config.getRefillTokens(), Duration.ofMinutes(config.getRefillDurationMinutes()))
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Scheduled cleanup every 5 minutes to purge inactive buckets and reset old backoff states.
     */
    @Scheduled(fixedRate = 300000)
    public void evictInactiveBuckets() {
        long now = System.currentTimeMillis();

        int bucketsRemoved = 0;
        for (Map.Entry<String, BucketEntry> entry : bucketMap.entrySet()) {
            if (now - entry.getValue().getLastAccessTimestamp() > INACTIVE_BUCKET_TTL_MS) {
                bucketMap.remove(entry.getKey());
                bucketsRemoved++;
            }
        }

        long resetAfterMs = TimeUnit.SECONDS.toMillis(rateLimitProperties.getAuth().getBackoff().getResetAfterSeconds());
        int backoffsRemoved = 0;
        for (Map.Entry<String, AccountBackoffState> entry : backoffMap.entrySet()) {
            if (now - entry.getValue().getLastFailureMs() > resetAfterMs && entry.getValue().getBackoffUntilMs() < now) {
                backoffMap.remove(entry.getKey());
                backoffsRemoved++;
            }
        }

        if (bucketsRemoved > 0 || backoffsRemoved > 0) {
            log.info("Evicted {} inactive rate buckets and {} expired backoff states", bucketsRemoved, backoffsRemoved);
        }
    }
}
