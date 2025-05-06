package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.KodEan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KodEanRepository extends JpaRepository<KodEan, Integer> {
    Optional<KodEan> findByKod(String kod);
}

