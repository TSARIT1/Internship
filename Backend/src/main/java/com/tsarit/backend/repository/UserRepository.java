package com.tsarit.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tsarit.backend.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByUsername(String username);

    Optional<User> findFirstByEmail(String email);
}
