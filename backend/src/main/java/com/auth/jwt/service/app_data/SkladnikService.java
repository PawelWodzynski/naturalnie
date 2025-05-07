package com.auth.jwt.service.app_data;

import com.auth.jwt.data.dto.app_data.SkladnikDto;
import com.auth.jwt.data.entity.app_data.Skladnik;
import com.auth.jwt.data.repository.app_data.SkladnikRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SkladnikService {

    private final SkladnikRepository skladnikRepository;

    @Autowired
    public SkladnikService(SkladnikRepository skladnikRepository) {
        this.skladnikRepository = skladnikRepository;
    }

    // Updated to return List<SkladnikDto>
    public List<SkladnikDto> getAllSkladniki() {
        return skladnikRepository.findAll().stream()
                .map(skladnik -> new SkladnikDto(skladnik.getId(), skladnik.getNazwa()))
                .collect(Collectors.toList());
    }

    // Optional: if you need to return DTO for single Skladnik as well
    public Optional<SkladnikDto> getSkladnikDtoById(Integer id) {
        return skladnikRepository.findById(id)
                .map(skladnik -> new SkladnikDto(skladnik.getId(), skladnik.getNazwa()));
    }

    public Optional<Skladnik> getSkladnikEntityById(Integer id) { // Kept for internal use if needed
        return skladnikRepository.findById(id);
    }

    public Skladnik createSkladnik(Skladnik skladnik) { // Input can remain Skladnik or be SkladnikDto if preferred
        if (skladnikRepository.findByNazwa(skladnik.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("Skladnik o nazwie '" + skladnik.getNazwa() + "' już istnieje.");
        }
        return skladnikRepository.save(skladnik);
    }

    // Consider if SkladnikDto should be used for input as well for consistency
    public Skladnik updateSkladnik(Integer id, Skladnik skladnikDetails) {
        Skladnik skladnik = skladnikRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skladnik o ID " + id + " nie znaleziony."));

        if (skladnikDetails.getNazwa() != null && !skladnikDetails.getNazwa().equals(skladnik.getNazwa())) {
            skladnikRepository.findByNazwa(skladnikDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Skladnik o nazwie '" + skladnikDetails.getNazwa() + "' już istnieje.");
                }
            });
            skladnik.setNazwa(skladnikDetails.getNazwa());
        }
        return skladnikRepository.save(skladnik);
    }

    public void deleteSkladnik(Integer id) {
        if (!skladnikRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skladnik o ID " + id + " nie znaleziony.");
        }
        skladnikRepository.deleteById(id);
    }
}

