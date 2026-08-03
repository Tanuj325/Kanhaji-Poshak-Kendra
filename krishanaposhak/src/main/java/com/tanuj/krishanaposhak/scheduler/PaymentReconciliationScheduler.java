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
public class PaymentReconciliationScheduler {

    private final PaymentService paymentService;

    @Value("${payment.reconciliation.enabled:true}")
    private boolean enabled;

    @Scheduled(cron = "${payment.reconciliation.cron:0 */15 * * * *}")
    public void runPaymentReconciliation() {
        if (!enabled) {
            log.info("Payment Reconciliation Scheduler is disabled.");
            return;
        }

        log.info("[SCHEDULER] Starting Payment Reconciliation Job...");
        try {
            int recovered = paymentService.reconcilePendingPayments();
            log.info("[SCHEDULER] Completed Payment Reconciliation Job. Recovered {} payments.", recovered);
        } catch (Exception e) {
            log.error("[SCHEDULER] Error during Payment Reconciliation Job: {}", e.getMessage(), e);
        }
    }
}
