package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.*;
import com.auth.jwt.data.repository.app_data.*;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProduktService {

    private final ProduktRepository produktRepository;
    private final RodzajProduktuRepository rodzajProduktuRepository;
    private final JednostkaRepository jednostkaRepository;
    private final NadKategoriaRepository nadKategoriaRepository;
    private final OpakowanieRepository opakowanieRepository;
    private final StawkaVatRepository stawkaVatRepository;
    private final KodTowaruRepository kodTowaruRepository;
    private final KodEanRepository kodEanRepository;
    private final IdentyfikatorRepository identyfikatorRepository;
    private final SkladnikRepository skladnikRepository;
    private final ZdjecieRepository zdjecieRepository;
    private final SkladnikService skladnikService;
    private final ObjectMapper objectMapper; // For JSON serialization

    @Autowired
    public ProduktService(ProduktRepository produktRepository,
                          RodzajProduktuRepository rodzajProduktuRepository,
                          JednostkaRepository jednostkaRepository,
                          NadKategoriaRepository nadKategoriaRepository,
                          OpakowanieRepository opakowanieRepository,
                          StawkaVatRepository stawkaVatRepository,
                          KodTowaruRepository kodTowaruRepository,
                          KodEanRepository kodEanRepository,
                          IdentyfikatorRepository identyfikatorRepository,
                          SkladnikRepository skladnikRepository,
                          ZdjecieRepository zdjecieRepository,
                          SkladnikService skladnikService,
                          ObjectMapper objectMapper) {
        this.produktRepository = produktRepository;
        this.rodzajProduktuRepository = rodzajProduktuRepository;
        this.jednostkaRepository = jednostkaRepository;
        this.nadKategoriaRepository = nadKategoriaRepository;
        this.opakowanieRepository = opakowanieRepository;
        this.stawkaVatRepository = stawkaVatRepository;
        this.kodTowaruRepository = kodTowaruRepository;
        this.kodEanRepository = kodEanRepository;
        this.identyfikatorRepository = identyfikatorRepository;
        this.skladnikRepository = skladnikRepository;
        this.zdjecieRepository = zdjecieRepository;
        this.skladnikService = skladnikService;
        this.objectMapper = objectMapper;
    }

    public List<Produkt> getAllProdukty() {
        return produktRepository.findAll();
    }

    public Page<Produkt> getAllProduktyPaginated(Pageable pageable, Integer nadKategoriaId) {
        if (nadKategoriaId != null) {
            return produktRepository.findByNadKategoria_Id(nadKategoriaId, pageable);
        } else {
            return produktRepository.findAll(pageable);
        }
    }

    public Optional<Produkt> getProduktById(Integer id) {
        return produktRepository.findById(id);
    }

    @Transactional("appDataTransactionManager")
    public Produkt createProdukt(Produkt produkt) {
        if (produktRepository.findByNazwa(produkt.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("Produkt o nazwie '" + produkt.getNazwa() + "' już istnieje.");
        }

        // Handle related entities (KodTowaru, KodEan, Identyfikator, Skladniki, Zdjecia)
        // This logic remains largely the same for managing the actual entities and their relationships

        // KodTowaru
        if (produkt.getKodTowaru() != null) {
            KodTowaru inputKt = produkt.getKodTowaru();
            if (inputKt.getId() != null) {
                produkt.setKodTowaru(kodTowaruRepository.findById(inputKt.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("KodTowaru not found with ID: " + inputKt.getId())));
            } else if (inputKt.getKod() != null) {
                Optional<KodTowaru> existingKt = kodTowaruRepository.findByKod(inputKt.getKod());
                if (existingKt.isPresent()) {
                    produkt.setKodTowaru(existingKt.get());
                } else {
                    inputKt.setId(null);
                    produkt.setKodTowaru(kodTowaruRepository.save(inputKt));
                }
            } else {
                 produkt.setKodTowaru(null);
            }
        } else {
            produkt.setKodTowaru(null);
        }

        // KodEan
        if (produkt.getKodEan() != null) {
            KodEan inputKe = produkt.getKodEan();
            if (inputKe.getId() != null) {
                produkt.setKodEan(kodEanRepository.findById(inputKe.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("KodEan not found with ID: " + inputKe.getId())));
            } else if (inputKe.getKod() != null) {
                Optional<KodEan> existingKe = kodEanRepository.findByKod(inputKe.getKod());
                if (existingKe.isPresent()) {
                    produkt.setKodEan(existingKe.get());
                } else {
                    inputKe.setId(null);
                    produkt.setKodEan(kodEanRepository.save(inputKe));
                }
            } else {
                produkt.setKodEan(null);
            }
        } else {
            produkt.setKodEan(null);
        }

        // Identyfikator
        if (produkt.getIdentyfikator() != null) {
            Identyfikator inputIdf = produkt.getIdentyfikator();
            if (inputIdf.getId() != null) {
                produkt.setIdentyfikator(identyfikatorRepository.findById(inputIdf.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Identyfikator not found with ID: " + inputIdf.getId())));
            } else if (inputIdf.getWartosc() != null) {
                Optional<Identyfikator> existingIdf = identyfikatorRepository.findByWartosc(inputIdf.getWartosc());
                if (existingIdf.isPresent()) {
                    produkt.setIdentyfikator(existingIdf.get());
                } else {
                    inputIdf.setId(null);
                    produkt.setIdentyfikator(identyfikatorRepository.save(inputIdf));
                }
            } else {
                produkt.setIdentyfikator(null);
            }
        } else {
            produkt.setIdentyfikator(null);
        }

        // Skladniki - manage entities and prepare IDs for JSON
        Set<Skladnik> managedSkladniki = new HashSet<>();
        if (produkt.getSkladnikiEntities() != null && !produkt.getSkladnikiEntities().isEmpty()) {
            for (Skladnik skladnikDetails : produkt.getSkladnikiEntities()) {
                if (skladnikDetails.getId() != null) {
                    Skladnik foundSkladnik = skladnikRepository.findById(skladnikDetails.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found with id: " + skladnikDetails.getId()));
                    managedSkladniki.add(foundSkladnik);
                } else if (skladnikDetails.getNazwa() != null) {
                    Optional<Skladnik> existingSkladnik = skladnikRepository.findByNazwa(skladnikDetails.getNazwa());
                    if (existingSkladnik.isPresent()) {
                        managedSkladniki.add(existingSkladnik.get());
                    } else {
                        managedSkladniki.add(skladnikService.createSkladnik(skladnikDetails));
                    }
                }
            }
        }
        produkt.setSkladnikiEntities(managedSkladniki); // Set the managed entities for @ManyToMany relationship
        // Serialize Skladnik IDs to JSON
        try {
            List<Integer> skladnikiIds = managedSkladniki.stream().map(Skladnik::getId).collect(Collectors.toList());
            produkt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
        } catch (JsonProcessingException e) {
            // Handle exception, e.g., log it or throw a custom exception
            throw new RuntimeException("Error serializing Skladnik IDs to JSON", e);
        }

        // Zdjecia - manage entities and prepare IDs for JSON
        List<Zdjecie> processedZdjecia = new ArrayList<>();
        if (produkt.getZdjeciaEntities() != null && !produkt.getZdjeciaEntities().isEmpty()) {
            for (Zdjecie zdjecie : produkt.getZdjeciaEntities()) {
                zdjecie.setId(null); 
                zdjecie.setProdukt(produkt); 
                processedZdjecia.add(zdjecie); 
            }
        }
        produkt.setZdjeciaEntities(processedZdjecia); // Set the processed entities for @OneToMany relationship
        // Save Produkt first to get its ID for Zdjecia, if Zdjecia are saved separately or if cascade is not enough
        // However, with CascadeType.ALL, saving Produkt should save ZdjeciaEntities.
        // We need their IDs after they are potentially saved by cascade.

        // Save the produkt entity (this will also cascade save ZdjeciaEntities and update Skladniki join table)
        Produkt savedProdukt = produktRepository.save(produkt);

        // Now that ZdjeciaEntities are saved (either by cascade or if we saved them explicitly after Produkt),
        // we can get their IDs and update zdjeciaJson.
        try {
            List<Integer> zdjeciaIds = savedProdukt.getZdjeciaEntities().stream()
                                                 .map(Zdjecie::getId)
                                                 .collect(Collectors.toList());
            savedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(zdjeciaIds));
            // We need to save the Produkt again to persist the zdjeciaJson field
            // This might cause issues if not handled carefully within the transaction.
            // A better approach might be to save Zdjecia first if they don't depend on Produkt ID from this save operation,
            // or to do this in two steps if necessary.
            // For now, let's assume the cascade saves Zdjecia and gives them IDs, then we update and save again.
            // This is not ideal. Let's refine.
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Zdjecie IDs to JSON", e);
        }
        
        // Refined approach for Zdjecia and Skladniki JSON fields:
        // 1. Prepare Skladnik entities and get their IDs.
        // 2. Prepare Zdjecie entities (set produkt, ID to null).
        // 3. Set SkladnikiJson based on prepared Skladnik IDs.
        // 4. Save Produkt (this will save Produkt, cascade save Zdjecia, update Skladniki join table).
        // 5. After Produkt is saved, Zdjecia will have IDs. Get these IDs and set ZdjeciaJson.
        // 6. Save Produkt again to update ZdjeciaJson.

        // Let's re-do the JSON part more cleanly:

        // Skladniki JSON (already done before initial save)

        // Zdjecia JSON (needs to be done AFTER zdjecia are saved and have IDs)
        // The Produkt entity is saved once. The Zdjecia are cascaded. After the save, they have IDs.
        // We then update the JSON field and save the Produkt again.
        
        // Initial save of Produkt and cascaded entities
        Produkt tempSavedProdukt = produktRepository.save(produkt);

        // Now, populate JSON fields based on the saved entities
        try {
            List<Integer> finalSkladnikiIds = tempSavedProdukt.getSkladnikiEntities().stream().map(Skladnik::getId).collect(Collectors.toList());
            tempSavedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(finalSkladnikiIds));

            List<Integer> finalZdjeciaIds = tempSavedProdukt.getZdjeciaEntities().stream().map(Zdjecie::getId).collect(Collectors.toList());
            tempSavedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(finalZdjeciaIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing IDs to JSON after save", e);
        }
        
        // Final save to persist the JSON string fields
        return produktRepository.save(tempSavedProdukt);
    }

    @Transactional("appDataTransactionManager")
    public Produkt updateProdukt(Integer id, Produkt produktDetails) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

        // Update basic fields (nazwa, waga, cena, flags, opis etc.)
        if (produktDetails.getNazwa() != null && !produktDetails.getNazwa().equals(produkt.getNazwa())) {
            produktRepository.findByNazwa(produktDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Produkt o nazwie '" + produktDetails.getNazwa() + "' już istnieje.");
                }
            });
            produkt.setNazwa(produktDetails.getNazwa());
        }
        if (produktDetails.getWaga() != null) produkt.setWaga(produktDetails.getWaga());
        if (produktDetails.getCena() != null) produkt.setCena(produktDetails.getCena());
        // ... update other simple fields ...

        // Update related entities (RodzajProduktu, Jednostka, etc. - by ID)
        // ... (logic for updating these by ID remains similar to create) ...

        // Update KodTowaru, KodEan, Identyfikator (by ID or by key, or create/update)
        // ... (logic for these remains similar to create, adapted for update) ...

        // Update Skladniki
        Set<Skladnik> updatedManagedSkladniki = new HashSet<>();
        if (produktDetails.getSkladnikiEntities() != null) { // Assuming input DTO/details provide Skladnik entities or IDs
            for (Skladnik skladnikDetail : produktDetails.getSkladnikiEntities()) {
                if (skladnikDetail.getId() != null) {
                    updatedManagedSkladniki.add(skladnikRepository.findById(skladnikDetail.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found with ID: " + skladnikDetail.getId())));
                } else if (skladnikDetail.getNazwa() != null) {
                     Optional<Skladnik> existingSkladnik = skladnikRepository.findByNazwa(skladnikDetail.getNazwa());
                    if (existingSkladnik.isPresent()) {
                        updatedManagedSkladniki.add(existingSkladnik.get());
                    } else {
                        updatedManagedSkladniki.add(skladnikService.createSkladnik(skladnikDetail));
                    }
                }
            }
        }
        produkt.getSkladnikiEntities().clear();
        produkt.getSkladnikiEntities().addAll(updatedManagedSkladniki);
        try {
            List<Integer> skladnikiIds = produkt.getSkladnikiEntities().stream().map(Skladnik::getId).collect(Collectors.toList());
            produkt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Skladnik IDs to JSON during update", e);
        }

        // Update Zdjecia
        // Clear existing zdjeciaEntities and repopulate based on produktDetails
        // This is a simple clear and add; a more complex diff and update might be needed for performance
        produkt.getZdjeciaEntities().clear();
        // Must remove from repository too if orphanRemoval=true is not enough or if they are not deleted by cascade
        zdjecieRepository.deleteByProduktId(produkt.getId()); // Custom method needed in ZdjecieRepository

        List<Zdjecie> newZdjeciaEntities = new ArrayList<>();
        if (produktDetails.getZdjeciaEntities() != null) {
            for (Zdjecie zdjecieDetail : produktDetails.getZdjeciaEntities()) {
                zdjecieDetail.setId(null); // Treat as new for simplicity in update
                zdjecieDetail.setProdukt(produkt);
                newZdjeciaEntities.add(zdjecieDetail); // Add to list, will be cascaded
            }
        }
        produkt.setZdjeciaEntities(newZdjeciaEntities);
        // The ZdjeciaEntities will be saved by cascade when 'produkt' is saved.
        // After saving, we can update the zdjeciaJson field.

        Produkt tempUpdatedProdukt = produktRepository.save(produkt);

        // Update JSON fields after save ensures IDs are available
        try {
            List<Integer> finalSkladnikiIds = tempUpdatedProdukt.getSkladnikiEntities().stream().map(Skladnik::getId).collect(Collectors.toList());
            tempUpdatedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(finalSkladnikiIds));

            List<Integer> finalZdjeciaIds = tempUpdatedProdukt.getZdjeciaEntities().stream().map(Zdjecie::getId).collect(Collectors.toList());
            tempUpdatedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(finalZdjeciaIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing IDs to JSON after update save", e);
        }

        return produktRepository.save(tempUpdatedProdukt);
    }

    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        Produkt produkt = produktRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
        // Zdjecia are deleted by cascade due to orphanRemoval=true and CascadeType.ALL
        // Skladniki join table entries are handled by JPA for @ManyToMany
        produktRepository.delete(produkt);
    }
}

