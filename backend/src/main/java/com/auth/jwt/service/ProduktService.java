package com.auth.jwt.service;

import com.auth.jwt.data.entity.Produkt;
import com.auth.jwt.data.repository.ProduktRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProduktService {

    private final ProduktRepository produktRepository;

    @Autowired
    public ProduktService(ProduktRepository produktRepository) {
        this.produktRepository = produktRepository;
    }

    // This method is for the new endpoint: /paginated-sorted-by-nadkategoria
    public Page<Produkt> getProduktyPaginatedFilteredAndSorted(Pageable pageable, Long nadKategoriaIdFilter) {
        if (nadKategoriaIdFilter != null) {
            // Uses the repository method with JOIN FETCH for specific nadkategoria
            return produktRepository.findByNadkategoria_IdWithAssociations(nadKategoriaIdFilter, pageable);
        } else {
            // Uses the overridden findAll which also has JOIN FETCH
            return produktRepository.findAll(pageable);
        }
    }
    
    // This is the method used by the endpoint /api/app-data/produkt/paginated (from user's cURL)
    // It needs to use the updated repository methods to fetch associations.
    public Page<Produkt> getAllProduktyPaginated(Pageable pageable, Integer nadKategoriaId) {
        if (nadKategoriaId != null) {
            // Use the specific query with JOIN FETCH for nadkategoria filter
            return produktRepository.findByNadkategoria_IdWithAssociations(nadKategoriaId.longValue(), pageable);
        } else {
            // Use the overridden findAll that now includes JOIN FETCH for all associations
            return produktRepository.findAll(pageable);
        }
    }
}

