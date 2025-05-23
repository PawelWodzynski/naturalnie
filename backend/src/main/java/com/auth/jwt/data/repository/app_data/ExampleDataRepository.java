package com.auth.jwt.data.repository.app_data;

import com.auth.jwt.data.entity.app_data.ExampleData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExampleDataRepository extends JpaRepository<ExampleData, Long> {

}
