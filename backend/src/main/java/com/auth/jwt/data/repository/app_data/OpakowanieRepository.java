package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Opakowanie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OpakowanieRepository extends JpaRepository<Opakowanie, Integer> {
}

