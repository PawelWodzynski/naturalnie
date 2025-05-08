package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.NadKategoria;
import com.auth.jwt.data.entity.app_data.Produkt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Integer> {
    Optional<Produkt> findByNazwa(String nazwa);
    Page<Produkt> findByNadKategoria(NadKategoria nadKategoria, Pageable pageable);

    // Page<Produkt> findAll(Pageable pageable); is inherited from JpaRepository
}

