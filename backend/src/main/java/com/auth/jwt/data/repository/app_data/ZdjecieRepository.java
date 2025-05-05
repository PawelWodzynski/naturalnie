package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.Zdjecie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZdjecieRepository extends JpaRepository<Zdjecie, Integer> {
}

