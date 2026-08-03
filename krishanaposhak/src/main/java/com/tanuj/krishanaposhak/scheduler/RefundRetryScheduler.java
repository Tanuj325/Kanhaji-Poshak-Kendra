package com.tanuj.krishanaposhak.scheduler;

import com.tanuj.krishanaposhak.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RefundRetryScheduler {

    private final RefundService refundService;

    @Value("${refund.retry.enabled:true}")
    private boolean enabled;

    @Value("${refund.retry.max-attempts:5}")
    private int maxAttempts;

    @Value("${refund.retry.backoff-base-minutes:5}")
    private int backoffBaseMinutes;

    @Scheduled(cron = "${refund.retry.cron:0 */15 * * * *}")
    public void runRefundRetry() {
        if (!enabled) {
            log.info("Refund Retry Scheduler is disabled.");
            return;
        }

        log.info("[SCHEDULER] Starting Refund Retry Job...");
        try {
            int retried = refundService.retryFailedRefunds(maxAttempts, backoffBaseMinutes);
            log.info("[SCHEDULER] Completed Refund Retry Job. Successfully retried {} refunds.", retried);
        } catch (Exception e) {
            log.error("[SCHEDULER] Error during Refund Retry Job: {}", e.getMessage(), e);
        }
    }
}
