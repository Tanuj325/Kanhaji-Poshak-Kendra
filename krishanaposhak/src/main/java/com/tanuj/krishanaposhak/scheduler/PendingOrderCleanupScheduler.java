package com.tanuj.krishanaposhak.scheduler;

import com.tanuj.krishanaposhak.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PendingOrderCleanupScheduler {

    private final PaymentService paymentService;

    @Value("${payment.cleanup.enabled:true}")
    private boolean enabled;

    @Scheduled(cron = "${payment.cleanup.cron:0 */30 * * * *}")
    public void runPendingOrderCleanup() {
        if (!enabled) {
            log.info("Pending Order Cleanup Scheduler is disabled.");
            return;
        }

        log.info("[SCHEDULER] Starting Pending Order Cleanup Job...");
        try {
            int cancelled = paymentService.cleanupUnpaidPendingOrders();
            log.info("[SCHEDULER] Completed Pending Order Cleanup Job. Cancelled {} expired unpaid orders.", cancelled);
        } catch (Exception e) {
            log.error("[SCHEDULER] Error during Pending Order Cleanup Job: {}", e.getMessage(), e);
        }
    }
}
