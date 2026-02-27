package com.tsarit.backend.repository;

import com.tsarit.backend.entity.User;
import com.tsarit.backend.entity.Webinar;
import com.tsarit.backend.entity.WebinarRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebinarRegistrationRepository extends JpaRepository<WebinarRegistration, Long> {

    List<WebinarRegistration> findByWebinar(Webinar webinar);

    List<WebinarRegistration> findByUser(User user);

    boolean existsByUserAndWebinar(User user, Webinar webinar);

    long countByWebinar(Webinar webinar);
}
