package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.KodTowaru;
import com.auth.jwt.data.repository.app_data.KodTowaruRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KodTowaruService {

    private final KodTowaruRepository kodTowaruRepository;

    @Autowired
    public KodTowaruService(KodTowaruRepository kodTowaruRepository) {
        this.kodTowaruRepository = kodTowaruRepository;
    }

    public List<KodTowaru> getAllKodyTowarow() {
        return kodTowaruRepository.findAll();
    }

    public Optional<KodTowaru> getKodTowaruById(Integer id) {
        return kodTowaruRepository.findById(id);
    }

    public KodTowaru createKodTowaru(KodTowaru kodTowaru) {
        // Check for duplicates by kod
        if (kodTowaruRepository.findByKod(kodTowaru.getKod()).isPresent()) {
            throw new IllegalArgumentException("KodTowaru o kodzie '" + kodTowaru.getKod() + "' już istnieje.");
        }
        return kodTowaruRepository.save(kodTowaru);
    }

    public KodTowaru updateKodTowaru(Integer id, KodTowaru kodTowaruDetails) {
        KodTowaru kodTowaru = kodTowaruRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KodTowaru o ID " + id + " nie znaleziony."));

        // Check for duplicates if kod is being changed
        if (kodTowaruDetails.getKod() != null && !kodTowaruDetails.getKod().equals(kodTowaru.getKod())) {
            kodTowaruRepository.findByKod(kodTowaruDetails.getKod()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("KodTowaru o kodzie '" + kodTowaruDetails.getKod() + "' już istnieje.");
                }
            });
            kodTowaru.setKod(kodTowaruDetails.getKod());
        }

        return kodTowaruRepository.save(kodTowaru);
    }

    public void deleteKodTowaru(Integer id) {
        if (!kodTowaruRepository.existsById(id)) {
            throw new ResourceNotFoundException("KodTowaru o ID " + id + " nie znaleziony.");
        }
        kodTowaruRepository.deleteById(id);
    }
}

