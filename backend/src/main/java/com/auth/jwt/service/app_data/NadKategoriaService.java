package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.NadKategoria;
import com.auth.jwt.data.repository.app_data.NadKategoriaRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NadKategoriaService {

    private final NadKategoriaRepository nadKategoriaRepository;

    @Autowired
    public NadKategoriaService(NadKategoriaRepository nadKategoriaRepository) {
        this.nadKategoriaRepository = nadKategoriaRepository;
    }

    public List<NadKategoria> getAllNadKategorie() {
        return nadKategoriaRepository.findAll();
    }

    public Optional<NadKategoria> getNadKategoriaById(Integer id) {
        return nadKategoriaRepository.findById(id);
    }

    public NadKategoria createNadKategoria(NadKategoria nadKategoria) {
        // Check for duplicates by nazwa
        if (nadKategoriaRepository.findByNazwa(nadKategoria.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("NadKategoria o nazwie '" + nadKategoria.getNazwa() + "' już istnieje.");
        }
        return nadKategoriaRepository.save(nadKategoria);
    }

    public NadKategoria updateNadKategoria(Integer id, NadKategoria nadKategoriaDetails) {
        NadKategoria nadKategoria = nadKategoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NadKategoria o ID " + id + " nie znaleziona."));

        // Check for duplicates if nazwa is being changed
        if (nadKategoriaDetails.getNazwa() != null && !nadKategoriaDetails.getNazwa().equals(nadKategoria.getNazwa())) {
            nadKategoriaRepository.findByNazwa(nadKategoriaDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("NadKategoria o nazwie '" + nadKategoriaDetails.getNazwa() + "' już istnieje.");
                }
            });
            nadKategoria.setNazwa(nadKategoriaDetails.getNazwa());
        }

        if (nadKategoriaDetails.getOpis() != null) {
            nadKategoria.setOpis(nadKategoriaDetails.getOpis());
        }
        if (nadKategoriaDetails.getKolejnosc() != null) {
            nadKategoria.setKolejnosc(nadKategoriaDetails.getKolejnosc());
        }

        return nadKategoriaRepository.save(nadKategoria);
    }

    public void deleteNadKategoria(Integer id) {
        if (!nadKategoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("NadKategoria o ID " + id + " nie znaleziona.");
        }
        nadKategoriaRepository.deleteById(id);
    }
}

