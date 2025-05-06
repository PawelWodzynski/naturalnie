package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Jednostka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JednostkaRepository extends JpaRepository<Jednostka, Integer> {
    Optional<Jednostka> findByNazwa(String nazwa);
    Optional<Jednostka> findBySkrot(String skrot); // Added missing method
}

