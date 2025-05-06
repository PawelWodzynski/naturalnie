package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.Jednostka;
import com.auth.jwt.data.repository.app_data.JednostkaRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JednostkaService {

    private final JednostkaRepository jednostkaRepository;

    @Autowired
    public JednostkaService(JednostkaRepository jednostkaRepository) {
        this.jednostkaRepository = jednostkaRepository;
    }

    public List<Jednostka> getAllJednostki() {
        return jednostkaRepository.findAll();
    }

    public Optional<Jednostka> getJednostkaById(Integer id) {
        return jednostkaRepository.findById(id);
    }

    public Jednostka createJednostka(Jednostka jednostka) {
        // Check for duplicates by nazwa or skrot
        if (jednostkaRepository.findByNazwa(jednostka.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("Jednostka o nazwie '" + jednostka.getNazwa() + "' już istnieje.");
        }
        if (jednostkaRepository.findBySkrot(jednostka.getSkrot()).isPresent()) {
            throw new IllegalArgumentException("Jednostka o skrócie '" + jednostka.getSkrot() + "' już istnieje.");
        }
        return jednostkaRepository.save(jednostka);
    }

    public Jednostka updateJednostka(Integer id, Jednostka jednostkaDetails) {
        Jednostka jednostka = jednostkaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jednostka o ID " + id + " nie znaleziona."));

        // Check for duplicates if nazwa or skrot are being changed
        if (jednostkaDetails.getNazwa() != null && !jednostkaDetails.getNazwa().equals(jednostka.getNazwa())) {
            jednostkaRepository.findByNazwa(jednostkaDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Jednostka o nazwie '" + jednostkaDetails.getNazwa() + "' już istnieje.");
                }
            });
            jednostka.setNazwa(jednostkaDetails.getNazwa());
        }

        if (jednostkaDetails.getSkrot() != null && !jednostkaDetails.getSkrot().equals(jednostka.getSkrot())) {
            jednostkaRepository.findBySkrot(jednostkaDetails.getSkrot()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Jednostka o skrócie '" + jednostkaDetails.getSkrot() + "' już istnieje.");
                }
            });
            jednostka.setSkrot(jednostkaDetails.getSkrot());
        }

        return jednostkaRepository.save(jednostka);
    }

    public void deleteJednostka(Integer id) {
        if (!jednostkaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Jednostka o ID " + id + " nie znaleziona.");
        }
        jednostkaRepository.deleteById(id);
    }
}

