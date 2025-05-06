package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.Identyfikator;
import com.auth.jwt.data.repository.app_data.IdentyfikatorRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IdentyfikatorService {

    private final IdentyfikatorRepository identyfikatorRepository;

    @Autowired
    public IdentyfikatorService(IdentyfikatorRepository identyfikatorRepository) {
        this.identyfikatorRepository = identyfikatorRepository;
    }

    public List<Identyfikator> getAllIdentyfikatory() {
        return identyfikatorRepository.findAll();
    }

    public Optional<Identyfikator> getIdentyfikatorById(Integer id) {
        return identyfikatorRepository.findById(id);
    }

    public Identyfikator createIdentyfikator(Identyfikator identyfikator) {
        // Check for duplicates by wartosc
        if (identyfikatorRepository.findByWartosc(identyfikator.getWartosc()).isPresent()) {
            throw new IllegalArgumentException("Identyfikator o wartości '" + identyfikator.getWartosc() + "' już istnieje.");
        }
        return identyfikatorRepository.save(identyfikator);
    }

    public Identyfikator updateIdentyfikator(Integer id, Identyfikator identyfikatorDetails) {
        Identyfikator identyfikator = identyfikatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Identyfikator o ID " + id + " nie znaleziony."));

        // Check for duplicates if wartosc is being changed
        if (identyfikatorDetails.getWartosc() != null && !identyfikatorDetails.getWartosc().equals(identyfikator.getWartosc())) {
            identyfikatorRepository.findByWartosc(identyfikatorDetails.getWartosc()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Identyfikator o wartości '" + identyfikatorDetails.getWartosc() + "' już istnieje.");
                }
            });
            identyfikator.setWartosc(identyfikatorDetails.getWartosc());
        }

        return identyfikatorRepository.save(identyfikator);
    }

    public void deleteIdentyfikator(Integer id) {
        if (!identyfikatorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Identyfikator o ID " + id + " nie znaleziony.");
        }
        identyfikatorRepository.deleteById(id);
    }
}

