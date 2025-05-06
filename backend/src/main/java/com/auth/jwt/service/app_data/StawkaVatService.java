package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.StawkaVat;
import com.auth.jwt.data.repository.app_data.StawkaVatRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class StawkaVatService {

    private final StawkaVatRepository stawkaVatRepository;

    @Autowired
    public StawkaVatService(StawkaVatRepository stawkaVatRepository) {
        this.stawkaVatRepository = stawkaVatRepository;
    }

    public List<StawkaVat> getAllStawkiVat() {
        return stawkaVatRepository.findAll();
    }

    public Optional<StawkaVat> getStawkaVatById(Integer id) {
        return stawkaVatRepository.findById(id);
    }

    public StawkaVat createStawkaVat(StawkaVat stawkaVat) {
        // Check for duplicates by wartosc
        if (stawkaVatRepository.findByWartosc(stawkaVat.getWartosc()).isPresent()) {
            throw new IllegalArgumentException("StawkaVat o wartości " + stawkaVat.getWartosc() + " już istnieje.");
        }
        return stawkaVatRepository.save(stawkaVat);
    }

    public StawkaVat updateStawkaVat(Integer id, StawkaVat stawkaVatDetails) {
        StawkaVat stawkaVat = stawkaVatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StawkaVat o ID " + id + " nie znaleziona."));

        // Check for duplicates if wartosc is being changed
        if (stawkaVatDetails.getWartosc() != null && stawkaVatDetails.getWartosc().compareTo(stawkaVat.getWartosc()) != 0) {
            stawkaVatRepository.findByWartosc(stawkaVatDetails.getWartosc()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("StawkaVat o wartości " + stawkaVatDetails.getWartosc() + " już istnieje.");
                }
            });
            stawkaVat.setWartosc(stawkaVatDetails.getWartosc());
        }

        return stawkaVatRepository.save(stawkaVat);
    }

    public void deleteStawkaVat(Integer id) {
        if (!stawkaVatRepository.existsById(id)) {
            throw new ResourceNotFoundException("StawkaVat o ID " + id + " nie znaleziona.");
        }
        stawkaVatRepository.deleteById(id);
    }
}

