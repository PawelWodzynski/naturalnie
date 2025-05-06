package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.Opakowanie;
import com.auth.jwt.data.repository.app_data.OpakowanieRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OpakowanieService {

    private final OpakowanieRepository opakowanieRepository;

    @Autowired
    public OpakowanieService(OpakowanieRepository opakowanieRepository) {
        this.opakowanieRepository = opakowanieRepository;
    }

    public List<Opakowanie> getAllOpakowania() {
        return opakowanieRepository.findAll();
    }

    public Optional<Opakowanie> getOpakowanieById(Integer id) {
        return opakowanieRepository.findById(id);
    }

    public Opakowanie createOpakowanie(Opakowanie opakowanie) {
        // Check for duplicates by nazwa
        if (opakowanieRepository.findByNazwa(opakowanie.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("Opakowanie o nazwie '" + opakowanie.getNazwa() + "' już istnieje.");
        }
        return opakowanieRepository.save(opakowanie);
    }

    public Opakowanie updateOpakowanie(Integer id, Opakowanie opakowanieDetails) {
        Opakowanie opakowanie = opakowanieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opakowanie o ID " + id + " nie znalezione."));

        // Check for duplicates if nazwa is being changed
        if (opakowanieDetails.getNazwa() != null && !opakowanieDetails.getNazwa().equals(opakowanie.getNazwa())) {
            opakowanieRepository.findByNazwa(opakowanieDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Opakowanie o nazwie '" + opakowanieDetails.getNazwa() + "' już istnieje.");
                }
            });
            opakowanie.setNazwa(opakowanieDetails.getNazwa());
        }

        if (opakowanieDetails.getOpis() != null) {
            opakowanie.setOpis(opakowanieDetails.getOpis());
        }

        return opakowanieRepository.save(opakowanie);
    }

    public void deleteOpakowanie(Integer id) {
        if (!opakowanieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Opakowanie o ID " + id + " nie znalezione.");
        }
        opakowanieRepository.deleteById(id);
    }
}

