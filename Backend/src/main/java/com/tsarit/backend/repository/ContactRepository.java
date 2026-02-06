package com.tsarit.backend.repository;

import com.tsarit.backend.entity.ContactQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<ContactQuery, Long> {
}
