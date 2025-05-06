package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.StawkaVat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface StawkaVatRepository extends JpaRepository<StawkaVat, Integer> {
    Optional<StawkaVat> findByWartosc(BigDecimal wartosc);
}

