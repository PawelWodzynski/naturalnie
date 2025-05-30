package com.auth.jwt.data.repository.auth.employee;

import com.auth.jwt.data.entity.auth.employee.EmployeeConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeConsentRepository extends JpaRepository<EmployeeConsent, Integer> {
    // Custom query methods can be added here if needed
}

