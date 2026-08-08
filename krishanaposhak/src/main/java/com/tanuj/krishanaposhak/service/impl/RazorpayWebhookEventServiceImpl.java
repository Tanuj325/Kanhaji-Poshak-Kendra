package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.entity.RazorpayWebhookEvent;
import com.tanuj.krishanaposhak.repository.RazorpayWebhookEventRepository;
import com.tanuj.krishanaposhak.service.RazorpayWebhookEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class RazorpayWebhookEventServiceImpl implements RazorpayWebhookEventService {

    private final RazorpayWebhookEventRepository webhookEventRepository;

    @Override
    @Transactional(readOnly = true)
    public boolean isAlreadyProcessed(String eventId) {
        if (eventId == null || eventId.isBlank()) {
            return false;
        }
        RazorpayWebhookEvent existing = webhookEventRepository.findByEventId(eventId);
        return existing != null && existing.getProcessedAt() != null;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordEventProcessed(String eventId, String eventType) {
        if (eventId == null || eventId.isBlank()) {
            return;
        }
        try {
            RazorpayWebhookEvent existing = webhookEventRepository.findByEventId(eventId);
            if (existing == null) {
                existing = RazorpayWebhookEvent.builder()
                        .eventId(eventId)
                        .eventType(eventType != null ? eventType : "unknown")
                        .build();
            }
            existing.setProcessedAt(Instant.now());
            webhookEventRepository.save(existing);
            log.info("[WEBHOOK_EVENT_LOG] Persisted webhook event record for eventId: {}, eventType: {}", eventId, eventType);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.warn("[WEBHOOK_EVENT_LOG] Duplicate webhook eventId already logged: {}", eventId);
        } catch (Exception e) {
            log.error("[WEBHOOK_EVENT_LOG] Failed to record webhook event for eventId {}: {}", eventId, e.getMessage());
        }
    }
}
