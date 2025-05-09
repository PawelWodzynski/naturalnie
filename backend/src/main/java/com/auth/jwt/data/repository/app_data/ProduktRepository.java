package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.NadKategoria;
import com.auth.jwt.data.entity.app_data.Produkt;
import com.auth.jwt.data.entity.app_data.RodzajProduktu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Integer> {
    Optional<Produkt> findByNazwa(String nazwa); // Exact match
    Page<Produkt> findByNadKategoria(NadKategoria nadKategoria, Pageable pageable);
    Page<Produkt> findByRodzajProduktu(RodzajProduktu rodzajProduktu, Pageable pageable);
    Page<Produkt> findByNadKategoriaAndRodzajProduktu(NadKategoria nadKategoria, RodzajProduktu rodzajProduktu, Pageable pageable);

    // New methods for searching by name (containing and case-insensitive)
    Page<Produkt> findByNazwaContainingIgnoreCase(String nazwa, Pageable pageable);
    Page<Produkt> findByNazwaContainingIgnoreCaseAndNadKategoria(String nazwa, NadKategoria nadKategoria, Pageable pageable);
    Page<Produkt> findByNazwaContainingIgnoreCaseAndRodzajProduktu(String nazwa, RodzajProduktu rodzajProduktu, Pageable pageable);
    Page<Produkt> findByNazwaContainingIgnoreCaseAndNadKategoriaAndRodzajProduktu(String nazwa, NadKategoria nadKategoria, RodzajProduktu rodzajProduktu, Pageable pageable);

    // Page<Produkt> findAll(Pageable pageable); is inherited from JpaRepository
}

