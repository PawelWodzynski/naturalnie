package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Opakowanie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OpakowanieRepository extends JpaRepository<Opakowanie, Integer> {
    Optional<Opakowanie> findByNazwa(String nazwa);
    Optional<Opakowanie> findBySkrot(String skrot);
}

