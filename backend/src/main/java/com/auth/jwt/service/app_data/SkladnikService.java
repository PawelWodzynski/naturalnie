package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.Skladnik;
import com.auth.jwt.data.repository.app_data.SkladnikRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkladnikService {

    private final SkladnikRepository skladnikRepository;

    @Autowired
    public SkladnikService(SkladnikRepository skladnikRepository) {
        this.skladnikRepository = skladnikRepository;
    }

    public List<Skladnik> getAllSkladniki() {
        return skladnikRepository.findAll();
    }

    public Optional<Skladnik> getSkladnikById(Integer id) {
        return skladnikRepository.findById(id);
    }

    public Skladnik createSkladnik(Skladnik skladnik) {
        // Check for duplicates by nazwa
        if (skladnikRepository.findByNazwa(skladnik.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("Skladnik o nazwie '" + skladnik.getNazwa() + "' już istnieje.");
        }
        return skladnikRepository.save(skladnik);
    }

    public Skladnik updateSkladnik(Integer id, Skladnik skladnikDetails) {
        Skladnik skladnik = skladnikRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skladnik o ID " + id + " nie znaleziony."));

        // Check for duplicates if nazwa is being changed
        if (skladnikDetails.getNazwa() != null && !skladnikDetails.getNazwa().equals(skladnik.getNazwa())) {
            skladnikRepository.findByNazwa(skladnikDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Skladnik o nazwie '" + skladnikDetails.getNazwa() + "' już istnieje.");
                }
            });
            skladnik.setNazwa(skladnikDetails.getNazwa());
        }
        // Note: Managing the 'produkty' Set<Produkt> relationship is typically handled
        // from the Produkt side or through a dedicated association management endpoint.
        // Basic Skladnik CRUD focuses on the Skladnik entity itself.

        return skladnikRepository.save(skladnik);
    }

    public void deleteSkladnik(Integer id) {
        if (!skladnikRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skladnik o ID " + id + " nie znaleziony.");
        }
        skladnikRepository.deleteById(id);
    }
}

