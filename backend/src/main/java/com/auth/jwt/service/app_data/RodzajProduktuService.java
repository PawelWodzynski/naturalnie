package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.RodzajProduktu;
import com.auth.jwt.data.repository.app_data.RodzajProduktuRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RodzajProduktuService {

    private final RodzajProduktuRepository rodzajProduktuRepository;

    @Autowired
    public RodzajProduktuService(RodzajProduktuRepository rodzajProduktuRepository) {
        this.rodzajProduktuRepository = rodzajProduktuRepository;
    }

    public List<RodzajProduktu> getAllRodzajeProduktow() {
        return rodzajProduktuRepository.findAll();
    }

    public Optional<RodzajProduktu> getRodzajProduktuById(Integer id) {
        return rodzajProduktuRepository.findById(id);
    }

    public RodzajProduktu createRodzajProduktu(RodzajProduktu rodzajProduktu) {
        // Check for duplicates by nazwa within the same NadKategoria
        if (rodzajProduktu.getNadKategoria() != null && rodzajProduktu.getNadKategoria().getId() != null) {
            if (rodzajProduktuRepository.findByNazwaAndNadKategoria_Id(rodzajProduktu.getNazwa(), rodzajProduktu.getNadKategoria().getId()).isPresent()) {
                throw new IllegalArgumentException("RodzajProduktu o nazwie '" + rodzajProduktu.getNazwa() + "' już istnieje w tej nadkategorii.");
            }
        } else if (rodzajProduktuRepository.findByNazwaAndNadKategoria_Id(rodzajProduktu.getNazwa(), null).isPresent()){
             throw new IllegalArgumentException("RodzajProduktu o nazwie '" + rodzajProduktu.getNazwa() + "' już istnieje bez przypisanej nadkategorii.");
        }
        return rodzajProduktuRepository.save(rodzajProduktu);
    }

    public RodzajProduktu updateRodzajProduktu(Integer id, RodzajProduktu rodzajProduktuDetails) {
        RodzajProduktu rodzajProduktu = rodzajProduktuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu o ID " + id + " nie znaleziony."));

        // Check for duplicates if nazwa or nadKategoria are being changed
        if (rodzajProduktuDetails.getNazwa() != null && !rodzajProduktuDetails.getNazwa().equals(rodzajProduktu.getNazwa())) {
            Integer nadKategoriaId = rodzajProduktuDetails.getNadKategoria() != null ? rodzajProduktuDetails.getNadKategoria().getId() : null;
            if (nadKategoriaId == null && rodzajProduktu.getNadKategoria() != null) {
                nadKategoriaId = rodzajProduktu.getNadKategoria().getId();
            }
            
            final Integer finalNadKategoriaId = nadKategoriaId;
            rodzajProduktuRepository.findByNazwaAndNadKategoria_Id(rodzajProduktuDetails.getNazwa(), finalNadKategoriaId).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("RodzajProduktu o nazwie '" + rodzajProduktuDetails.getNazwa() + "' już istnieje w tej nadkategorii.");
                }
            });
            rodzajProduktu.setNazwa(rodzajProduktuDetails.getNazwa());
        }

        if (rodzajProduktuDetails.getOpis() != null) {
            rodzajProduktu.setOpis(rodzajProduktuDetails.getOpis());
        }
        if (rodzajProduktuDetails.getNadKategoria() != null) {
            // Ensure NadKategoria exists if it's being set/changed
            // This might require fetching NadKategoria from its repository if only ID is provided
            rodzajProduktu.setNadKategoria(rodzajProduktuDetails.getNadKategoria());
        }

        return rodzajProduktuRepository.save(rodzajProduktu);
    }

    public void deleteRodzajProduktu(Integer id) {
        if (!rodzajProduktuRepository.existsById(id)) {
            throw new ResourceNotFoundException("RodzajProduktu o ID " + id + " nie znaleziony.");
        }
        rodzajProduktuRepository.deleteById(id);
    }
}

