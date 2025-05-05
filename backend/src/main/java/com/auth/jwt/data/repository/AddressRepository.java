package com.auth.jwt.data.repository;

import com.auth.jwt.data.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    // Custom query methods can be added here if needed
}

