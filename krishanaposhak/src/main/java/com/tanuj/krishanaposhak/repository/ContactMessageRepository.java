package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findByResolvedFalseOrderByCreatedAtDesc();

    List<ContactMessage> findByResolvedTrueOrderByCreatedAtDesc();

    long countByResolvedFalse();

    /**
     * Get the N most recent contact messages ordered by creation date descending.
     *
     * @param n the number of recent contact messages to retrieve
     * @return list of recent contact messages
     */
    List<ContactMessage> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}