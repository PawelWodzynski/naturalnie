package com.auth.jwt.data.repository.auth.employee;

import com.auth.jwt.data.entity.auth.employee.AlternativeAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlternativeAddressRepository extends JpaRepository<AlternativeAddress, Integer> {
    // No custom methods needed for now, JpaRepository provides save()
}

