package com.tsarit.backend.repository;

import com.tsarit.backend.entity.Ticket;
import com.tsarit.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserOrderByCreatedAtDesc(User user);
    List<Ticket> findAllByOrderByCreatedAtDesc();
    List<Ticket> findByStatusOrderByCreatedAtDesc(String status);
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    long countByStatus(String status);
}
