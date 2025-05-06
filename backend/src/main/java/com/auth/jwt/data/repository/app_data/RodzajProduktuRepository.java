package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.RodzajProduktu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RodzajProduktuRepository extends JpaRepository<RodzajProduktu, Integer> {
    Optional<RodzajProduktu> findByNazwa(String nazwa);
    Optional<RodzajProduktu> findByNazwaAndNadKategoria_Id(String nazwa, Integer nadKategoriaId);
}

