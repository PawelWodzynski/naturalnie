package com.auth.jwt.service;

import com.auth.jwt.data.entity.app_data.ExampleData;
import com.auth.jwt.data.repository.app_data.ExampleDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ExampleDataService {

    private final ExampleDataRepository exampleDataRepository;

    @Autowired
    public ExampleDataService(ExampleDataRepository exampleDataRepository) {
        this.exampleDataRepository = exampleDataRepository;
    }

    /**
     * Fetches all ExampleData records from the repository.
     * This method encapsulates the database interaction logic.
     * @return List of ExampleData objects.
     * @throws RuntimeException if there is an error during data fetching.
     */
    public List<ExampleData> getAllExampleData() {
         try {
             return exampleDataRepository.findAll();
         } catch (Exception e) {
             // Log the exception
             log.error("getAllExampleData " + e);
             return null; // Placeholder for outline
         }
    }
}

