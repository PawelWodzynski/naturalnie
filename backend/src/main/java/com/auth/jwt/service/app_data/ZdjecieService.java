package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.Zdjecie;
import com.auth.jwt.data.repository.app_data.ZdjecieRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Zdjecie createZdjecie(Zdjecie zdjecie) {
        // Check for duplicates by url for the same produkt
        if (zdjecie.getProdukt() != null && zdjecie.getProdukt().getId() != null) {
            if (zdjecieRepository.findByUrlAndProdukt_Id(zdjecie.getUrl(), zdjecie.getProdukt().getId()).isPresent()) {
                throw new IllegalArgumentException("Zdjecie o URL '" + zdjecie.getUrl() + "' już istnieje dla tego produktu.");
            }
        }
        return zdjecieRepository.save(zdjecie);
    }

    public Zdjecie updateZdjecie(Integer id, Zdjecie zdjecieDetails) {
        Zdjecie zdjecie = zdjecieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zdjecie o ID " + id + " nie znalezione."));

        // Check for duplicates if url or produkt are being changed
        if (zdjecieDetails.getUrl() != null && !zdjecieDetails.getUrl().equals(zdjecie.getUrl())) {
            Integer produktId = zdjecieDetails.getProdukt() != null ? zdjecieDetails.getProdukt().getId() : (zdjecie.getProdukt() != null ? zdjecie.getProdukt().getId() : null);
            if (produktId != null) {
                zdjecieRepository.findByUrlAndProdukt_Id(zdjecieDetails.getUrl(), produktId).ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new IllegalArgumentException("Zdjecie o URL '" + zdjecieDetails.getUrl() + "' już istnieje dla tego produktu.");
                    }
                });
            }
            zdjecie.setUrl(zdjecieDetails.getUrl());
        }

        if (zdjecieDetails.getOpis() != null) {
            zdjecie.setOpis(zdjecieDetails.getOpis());
        }
        if (zdjecieDetails.getKolejnosc() != null) {
            zdjecie.setKolejnosc(zdjecieDetails.getKolejnosc());
        }
        // Produkt association should be handled carefully, usually set during creation
        // or through a dedicated product management endpoint.
        // If zdjecieDetails.getProdukt() is provided and different, it implies changing the association.
        if (zdjecieDetails.getProdukt() != null && (zdjecie.getProdukt() == null || !zdjecieDetails.getProdukt().getId().equals(zdjecie.getProdukt().getId()))) {
            // Potentially fetch and set the new Produkt entity if only ID is provided
            zdjecie.setProdukt(zdjecieDetails.getProdukt());
        }

        return zdjecieRepository.save(zdjecie);
    }

    public void deleteZdjecie(Integer id) {
        if (!zdjecieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Zdjecie o ID " + id + " nie znalezione.");
        }
        zdjecieRepository.deleteById(id);
    }
}

