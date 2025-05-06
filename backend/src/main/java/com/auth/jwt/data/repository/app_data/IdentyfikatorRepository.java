package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Identyfikator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IdentyfikatorRepository extends JpaRepository<Identyfikator, Integer> {
    Optional<Identyfikator> findByWartosc(String wartosc);
}

