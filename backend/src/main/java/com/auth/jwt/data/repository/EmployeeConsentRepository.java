package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.EmployeeConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeConsentRepository extends JpaRepository<EmployeeConsent, Integer> {
    // Custom query methods can be added here if needed
}

