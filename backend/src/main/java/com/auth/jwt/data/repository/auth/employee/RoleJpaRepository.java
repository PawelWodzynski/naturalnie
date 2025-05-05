package com.auth.jwt.data.repository.auth.employee;

import com.auth.jwt.data.entity.auth.employee.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleJpaRepository extends JpaRepository<Role, Long> {
    
    Role findByName(String name);
}
