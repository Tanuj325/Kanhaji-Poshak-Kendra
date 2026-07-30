package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.RazorpayWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RazorpayWebhookEventRepository extends JpaRepository<RazorpayWebhookEvent, Long> {

    RazorpayWebhookEvent findByEventId(String eventId);

}