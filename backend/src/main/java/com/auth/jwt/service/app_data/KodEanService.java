package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.KodEan;
import com.auth.jwt.data.repository.app_data.KodEanRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KodEanService {

    private final KodEanRepository kodEanRepository;

    @Autowired
    public KodEanService(KodEanRepository kodEanRepository) {
        this.kodEanRepository = kodEanRepository;
    }

    public List<KodEan> getAllKodyEan() {
        return kodEanRepository.findAll();
    }

    public Optional<KodEan> getKodEanById(Integer id) {
        return kodEanRepository.findById(id);
    }

    public KodEan createKodEan(KodEan kodEan) {
        // Check for duplicates by kod
        if (kodEanRepository.findByKod(kodEan.getKod()).isPresent()) {
            throw new IllegalArgumentException("KodEan o kodzie '" + kodEan.getKod() + "' już istnieje.");
        }
        return kodEanRepository.save(kodEan);
    }

    public KodEan updateKodEan(Integer id, KodEan kodEanDetails) {
        KodEan kodEan = kodEanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KodEan o ID " + id + " nie znaleziony."));

        // Check for duplicates if kod is being changed
        if (kodEanDetails.getKod() != null && !kodEanDetails.getKod().equals(kodEan.getKod())) {
            kodEanRepository.findByKod(kodEanDetails.getKod()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("KodEan o kodzie '" + kodEanDetails.getKod() + "' już istnieje.");
                }
            });
            kodEan.setKod(kodEanDetails.getKod());
        }

        return kodEanRepository.save(kodEan);
    }

    public void deleteKodEan(Integer id) {
        if (!kodEanRepository.existsById(id)) {
            throw new ResourceNotFoundException("KodEan o ID " + id + " nie znaleziony.");
        }
        kodEanRepository.deleteById(id);
    }
}

