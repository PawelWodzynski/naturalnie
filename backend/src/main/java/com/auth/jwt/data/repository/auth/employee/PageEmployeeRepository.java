package com.auth.jwt.data.repository.auth.employee;

import com.auth.jwt.data.entity.auth.employee.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageEmployeeRepository extends JpaRepository<Employee,Integer> {


    Page<Employee>findByUserNameContaining(String userName, Pageable pageable);



}
