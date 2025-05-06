package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.Zdjecie;
import com.auth.jwt.data.repository.app_data.ZdjecieRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ZdjecieService {

    private final ZdjecieRepository zdjecieRepository;

    @Autowired
    public ZdjecieService(ZdjecieRepository zdjecieRepository) {
        this.zdjecieRepository = zdjecieRepository;
    }

    public List<Zdjecie> getAllZdjecia() {
        return zdjecieRepository.findAll();
    }

    public Optional<Zdjecie> getZdjecieById(Integer id) {
        return zdjecieRepository.findById(id);
    }

    public List<Zdjecie> getZdjeciaByProduktId(Integer produktId) {
        return zdjecieRepository.findByProduktId(produktId);
    }

    @Transactional("appDataTransactionManager")
    public Zdjecie createZdjecie(Zdjecie zdjecie) {
        // Business logic for checking duplicates based on byte[] (daneZdjecia) might be complex
        // and is not implemented here. If specific duplicate detection is needed for binary data,
        // it would require a more sophisticated approach (e.g., hashing, comparison service).
        // For now, we save the Zdjecie as is, assuming Produkt is already set.
        if (zdjecie.getProdukt() == null || zdjecie.getProdukt().getId() == null) {
            throw new IllegalArgumentException("Produkt must be associated with Zdjecie before saving.");
        }
        // Ensure daneZdjecia is not null or empty if it's a requirement
        if (zdjecie.getDaneZdjecia() == null || zdjecie.getDaneZdjecia().length == 0) {
            throw new IllegalArgumentException("Dane zdjecia (image data) cannot be empty.");
        }
        return zdjecieRepository.save(zdjecie);
    }

    @Transactional("appDataTransactionManager")
    public Zdjecie updateZdjecie(Integer id, Zdjecie zdjecieDetails) {
        Zdjecie zdjecie = zdjecieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zdjecie o ID " + id + " nie znalezione."));

        // Update daneZdjecia if provided
        if (zdjecieDetails.getDaneZdjecia() != null && zdjecieDetails.getDaneZdjecia().length > 0) {
            zdjecie.setDaneZdjecia(zdjecieDetails.getDaneZdjecia());
        }

        if (zdjecieDetails.getOpis() != null) {
            zdjecie.setOpis(zdjecieDetails.getOpis());
        }
        if (zdjecieDetails.getKolejnosc() != null) {
            zdjecie.setKolejnosc(zdjecieDetails.getKolejnosc());
        }
        
        // Produkt association update is generally not recommended here directly.
        // It's better to manage this through the Produkt entity's lifecycle.
        // If zdjecieDetails.getProdukt() is provided and different, it implies changing the association.
        // This should be handled with caution and clear business rules.
        if (zdjecieDetails.getProdukt() != null && 
            (zdjecie.getProdukt() == null || !zdjecieDetails.getProdukt().getId().equals(zdjecie.getProdukt().getId()))) {
            // Ensure the new Produkt exists if only an ID is passed or if it's a detached entity.
            // This might require fetching the Produkt entity from its repository.
            // For simplicity, assuming zdjecieDetails.getProdukt() is a managed entity or has a valid ID.
            zdjecie.setProdukt(zdjecieDetails.getProdukt()); 
        }

        return zdjecieRepository.save(zdjecie);
    }

    @Transactional("appDataTransactionManager")
    public void deleteZdjecie(Integer id) {
        if (!zdjecieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Zdjecie o ID " + id + " nie znalezione.");
        }
        zdjecieRepository.deleteById(id);
    }

    // The method findByUrlAndProdukt_Id was removed from ZdjecieRepository as URL is no longer a field.
    // If a similar check is needed for daneZdjecia, it would require a custom query or logic.
}

