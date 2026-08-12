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
    @Transactional(readOnly = true)
    public boolean isAlreadyAccepted(String eventId) {
        if (eventId == null || eventId.isBlank()) {
            return false;
        }
        return webhookEventRepository.findByEventId(eventId) != null;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean recordEventAccepted(String eventId, String eventType) {
        if (eventId == null || eventId.isBlank()) {
            return false;
        }
        try {
            RazorpayWebhookEvent event = RazorpayWebhookEvent.builder()
                    .eventId(eventId)
                    .eventType(eventType != null ? eventType : "unknown")
                    .receivedAt(Instant.now())
                    .status("RECEIVED")
                    .build();
            webhookEventRepository.save(event);
            log.info("[WEBHOOK_EVENT_ACCEPTED] Recorded new webhook event. EventId: {}, EventType: {}", eventId, eventType);
            return true;
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.info("[WEBHOOK_EVENT_DUPLICATE] Event already exists: {}", eventId);
            return false;
        } catch (Exception e) {
            log.error("[WEBHOOK_EVENT_ACCEPT_ERROR] Failed to record event {}: {}", eventId, e.getMessage());
            return false;
        }
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
                        .receivedAt(Instant.now())
                        .build();
            }
            existing.setProcessedAt(Instant.now());
            existing.setStatus("PROCESSED");
            webhookEventRepository.save(existing);
            log.info("[WEBHOOK_EVENT_PROCESSED] Persisted webhook event record for eventId: {}, eventType: {}", eventId, eventType);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.warn("[WEBHOOK_EVENT_DUPLICATE] Duplicate webhook eventId already logged: {}", eventId);
        } catch (Exception e) {
            log.error("[WEBHOOK_EVENT_PROCESS_ERROR] Failed to record webhook event for eventId {}: {}", eventId, e.getMessage());
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markEventFailed(String eventId, String reason) {
        if (eventId == null || eventId.isBlank()) {
            return;
        }
        try {
            RazorpayWebhookEvent existing = webhookEventRepository.findByEventId(eventId);
            if (existing != null) {
                existing.setStatus("FAILED");
                existing.setFailureReason(
                        reason != null ? reason.substring(0, Math.min(reason.length(), 500)) : null);
                webhookEventRepository.save(existing);
                log.info("[WEBHOOK_EVENT_FAILED] Marked event as failed. EventId: {}", eventId);
            }
        } catch (Exception e) {
            log.error("[WEBHOOK_EVENT_FAIL_ERROR] Could not mark event {} as failed: {}", eventId, e.getMessage());
        }
    }
}

