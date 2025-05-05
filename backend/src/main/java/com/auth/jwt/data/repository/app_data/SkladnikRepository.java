package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Skladnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkladnikRepository extends JpaRepository<Skladnik, Integer> {
}

