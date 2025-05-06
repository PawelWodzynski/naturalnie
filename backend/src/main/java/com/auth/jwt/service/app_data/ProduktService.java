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
    private final SkladnikService skladnikService; // Assuming SkladnikService has a createSkladnik method
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
            throw new IllegalArgumentException("Produkt o nazwie '" + produkt.getNazwa() + "' ju	 istnieje.");
        }

        // Handle simple one-to-one relations (KodTowaru, KodEan, Identyfikator)
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
                    inputKt.setId(null); // Ensure it's treated as new
                    produkt.setKodTowaru(kodTowaruRepository.save(inputKt));
                }
            } else {
                 produkt.setKodTowaru(null); // Or throw error if kod is mandatory for new KodTowaru
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
                    inputKe.setId(null); // Ensure it's treated as new
                    produkt.setKodEan(kodEanRepository.save(inputKe));
                }
            } else {
                produkt.setKodEan(null); // Or throw error if kod is mandatory
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
                    inputIdf.setId(null); // Ensure it's treated as new
                    produkt.setIdentyfikator(identyfikatorRepository.save(inputIdf));
                }
            } else {
                produkt.setIdentyfikator(null); // Or throw error if wartosc is mandatory
            }
        } else {
            produkt.setIdentyfikator(null);
        }
        
        // Handle SkladnikiEntities
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
                        // Assuming SkladnikService.createSkladnik saves and returns the managed Skladnik
                        managedSkladniki.add(skladnikService.createSkladnik(new Skladnik(skladnikDetails.getNazwa())));
                    }
                }
            }
        }
        produkt.setSkladnikiEntities(managedSkladniki);

        // Handle ZdjeciaEntities
        List<Zdjecie> processedZdjecia = new ArrayList<>();
        if (produkt.getZdjeciaEntities() != null && !produkt.getZdjeciaEntities().isEmpty()) {
            for (Zdjecie zdjecieInput : produkt.getZdjeciaEntities()) {
                Zdjecie newZdjecie = new Zdjecie();
                newZdjecie.setUrl(zdjecieInput.getUrl());
                newZdjecie.setOpis(zdjecieInput.getOpis());
                newZdjecie.setProdukt(produkt); // Link to the current Produkt instance
                newZdjecie.setId(null); // Ensure it's treated as new
                processedZdjecia.add(newZdjecie);
            }
        }
        produkt.setZdjeciaEntities(processedZdjecia);

        // First save: Persist Produkt and cascade save ZdjeciaEntities, manage SkladnikiEntities join table
        Produkt savedProdukt = produktRepository.save(produkt);

        // Populate JSON fields based on the saved (and now ID-populated) entities
        try {
            List<Integer> finalSkladnikiIds = savedProdukt.getSkladnikiEntities().stream()
                                                        .map(Skladnik::getId)
                                                        .collect(Collectors.toList());
            savedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(finalSkladnikiIds));

            List<Integer> finalZdjeciaIds = savedProdukt.getZdjeciaEntities().stream()
                                                      .map(Zdjecie::getId)
                                                      .collect(Collectors.toList());
            savedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(finalZdjeciaIds));
        } catch (JsonProcessingException e) {
            // Log the error and consider how to handle it - rethrowing as RuntimeException for now
            // logger.error("Error serializing Skladnik/Zdjecie IDs to JSON for Produkt ID: {}", savedProdukt.getId(), e);
            throw new RuntimeException("Error serializing Skladnik/Zdjecie IDs to JSON after save", e);
        }
        
        // Second save: Persist the zdjeciaJson and skladnikiJson string fields
        return produktRepository.save(savedProdukt);
    }

    @Transactional("appDataTransactionManager")
    public Produkt updateProdukt(Integer id, Produkt produktDetails) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

        // Update basic fields
        if (produktDetails.getNazwa() != null && !produktDetails.getNazwa().equals(produkt.getNazwa())) {
            produktRepository.findByNazwa(produktDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Produkt o nazwie '" + produktDetails.getNazwa() + "' ju	 istnieje.");
                }
            });
            produkt.setNazwa(produktDetails.getNazwa());
        }
        if (produktDetails.getWaga() != null) produkt.setWaga(produktDetails.getWaga());
        if (produktDetails.getCena() != null) produkt.setCena(produktDetails.getCena());
        if (produktDetails.getSuperProdukt() != null) produkt.setSuperProdukt(produktDetails.getSuperProdukt());
        if (produktDetails.getTowarPolecany() != null) produkt.setTowarPolecany(produktDetails.getTowarPolecany());
        if (produktDetails.getRekomendacjaSprzedawcy() != null) produkt.setRekomendacjaSprzedawcy(produktDetails.getRekomendacjaSprzedawcy());
        if (produktDetails.getSuperCena() != null) produkt.setSuperCena(produktDetails.getSuperCena());
        if (produktDetails.getNowosc() != null) produkt.setNowosc(produktDetails.getNowosc());
        if (produktDetails.getSuperjakosc() != null) produkt.setSuperjakosc(produktDetails.getSuperjakosc());
        if (produktDetails.getRabat() != null) produkt.setRabat(produktDetails.getRabat());
        if (produktDetails.getDostepny() != null) produkt.setDostepny(produktDetails.getDostepny());
        if (produktDetails.getDostepneOdReki() != null) produkt.setDostepneOdReki(produktDetails.getDostepneOdReki());
        if (produktDetails.getDostepneDo7Dni() != null) produkt.setDostepneDo7Dni(produktDetails.getDostepneDo7Dni());
        if (produktDetails.getDostepneNaZamowienie() != null) produkt.setDostepneNaZamowienie(produktDetails.getDostepneNaZamowienie());
        if (produktDetails.getWartoKupic() != null) produkt.setWartoKupic(produktDetails.getWartoKupic());
        if (produktDetails.getBezglutenowy() != null) produkt.setBezglutenowy(produktDetails.getBezglutenowy());
        if (produktDetails.getOpis() != null) produkt.setOpis(produktDetails.getOpis());
        // wyswietlenia and data fields are usually managed by system/DB

        // Update simple relations by ID
        if (produktDetails.getRodzajProduktu() != null && produktDetails.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produktDetails.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found")));
        }
        if (produktDetails.getJednostka() != null && produktDetails.getJednostka().getId() != null) {
            produkt.setJednostka(jednostkaRepository.findById(produktDetails.getJednostka().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jednostka not found")));
        }
        if (produktDetails.getNadKategoria() != null && produktDetails.getNadKategoria().getId() != null) {
            produkt.setNadKategoria(nadKategoriaRepository.findById(produktDetails.getNadKategoria().getId())
                .orElseThrow(() -> new ResourceNotFoundException("NadKategoria not found")));
        }
        if (produktDetails.getOpakowanie() != null && produktDetails.getOpakowanie().getId() != null) {
            produkt.setOpakowanie(opakowanieRepository.findById(produktDetails.getOpakowanie().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Opakowanie not found")));
        }
        if (produktDetails.getStawkaVat() != null && produktDetails.getStawkaVat().getId() != null) {
            produkt.setStawkaVat(stawkaVatRepository.findById(produktDetails.getStawkaVat().getId())
                .orElseThrow(() -> new ResourceNotFoundException("StawkaVat not found")));
        }

        // Update KodTowaru, KodEan, Identyfikator (similar to create, but fetch or create/update)
        // KodTowaru
        if (produktDetails.getKodTowaru() != null) {
            KodTowaru inputKt = produktDetails.getKodTowaru();
            if (inputKt.getId() != null) {
                produkt.setKodTowaru(kodTowaruRepository.findById(inputKt.getId()).orElse(null)); // Or throw
            } else if (inputKt.getKod() != null) {
                produkt.setKodTowaru(kodTowaruRepository.findByKod(inputKt.getKod())
                    .orElseGet(() -> kodTowaruRepository.save(new KodTowaru(inputKt.getKod()))));
            }
        } else {
            produkt.setKodTowaru(null);
        }
        // Similar logic for KodEan and Identyfikator
        if (produktDetails.getKodEan() != null) {
            KodEan inputKe = produktDetails.getKodEan();
            if (inputKe.getId() != null) {
                produkt.setKodEan(kodEanRepository.findById(inputKe.getId()).orElse(null));
            } else if (inputKe.getKod() != null) {
                produkt.setKodEan(kodEanRepository.findByKod(inputKe.getKod())
                    .orElseGet(() -> kodEanRepository.save(new KodEan(inputKe.getKod()))));
            }
        } else {
            produkt.setKodEan(null);
        }

        if (produktDetails.getIdentyfikator() != null) {
            Identyfikator inputIdf = produktDetails.getIdentyfikator();
            if (inputIdf.getId() != null) {
                produkt.setIdentyfikator(identyfikatorRepository.findById(inputIdf.getId()).orElse(null));
            } else if (inputIdf.getWartosc() != null) {
                produkt.setIdentyfikator(identyfikatorRepository.findByWartosc(inputIdf.getWartosc())
                    .orElseGet(() -> identyfikatorRepository.save(new Identyfikator(inputIdf.getWartosc()))));
            }
        } else {
            produkt.setIdentyfikator(null);
        }

        // Update Skladniki
        Set<Skladnik> updatedSkladniki = new HashSet<>();
        if (produktDetails.getSkladnikiEntities() != null) {
            for (Skladnik skladnikDetail : produktDetails.getSkladnikiEntities()) {
                if (skladnikDetail.getId() != null) {
                    updatedSkladniki.add(skladnikRepository.findById(skladnikDetail.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found with ID: " + skladnikDetail.getId())));
                } else if (skladnikDetail.getNazwa() != null) {
                    updatedSkladniki.add(skladnikRepository.findByNazwa(skladnikDetail.getNazwa())
                        .orElseGet(() -> skladnikService.createSkladnik(new Skladnik(skladnikDetail.getNazwa()))));
                }
            }
        }
        produkt.getSkladnikiEntities().clear();
        produkt.getSkladnikiEntities().addAll(updatedSkladniki);

        // Update Zdjecia
        // First, remove zdjecia that are no longer in the list (if orphanRemoval=true is not enough or for more control)
        List<Integer> newImageIds = new ArrayList<>();
        if (produktDetails.getZdjeciaEntities() != null) {
            newImageIds = produktDetails.getZdjeciaEntities().stream()
                                       .map(Zdjecie::getId)
                                       .filter(java.util.Objects::nonNull)
                                       .collect(Collectors.toList());
        }
        // Remove old images not present in the new list
        // zdjecieRepository.deleteByProduktIdAndIdNotIn(produkt.getId(), newImageIds); // If newImageIds can be empty, this might delete all.
        // A safer approach: fetch current, compare, delete.
        List<Zdjecie> existingZdjecia = zdjecieRepository.findByProduktId(produkt.getId());
        List<Zdjecie> zdjeciaToRemove = existingZdjecia.stream()
            .filter(ez -> !newImageIds.contains(ez.getId()))
            .collect(Collectors.toList());
        zdjecieRepository.deleteAll(zdjeciaToRemove);
        produkt.getZdjeciaEntities().removeIf(z -> zdjeciaToRemove.stream().anyMatch(r -> r.getId().equals(z.getId())));

        // Add or update images
        if (produktDetails.getZdjeciaEntities() != null) {
            for (Zdjecie zdjecieDetail : produktDetails.getZdjeciaEntities()) {
                if (zdjecieDetail.getId() != null) { // Existing image, potentially update URL/Opis
                    Zdjecie existingZdjecie = zdjecieRepository.findById(zdjecieDetail.getId()).orElse(null);
                    if (existingZdjecie != null && existingZdjecie.getProdukt().getId().equals(produkt.getId())) {
                        if (zdjecieDetail.getUrl() != null) existingZdjecie.setUrl(zdjecieDetail.getUrl());
                        if (zdjecieDetail.getOpis() != null) existingZdjecie.setOpis(zdjecieDetail.getOpis());
                        // No need to add to produkt.getZdjeciaEntities() if it's already there and managed by JPA
                    } // else: trying to assign image from another product or non-existent, handle error or ignore
                } else { // New image
                    Zdjecie newZdjecie = new Zdjecie();
                    newZdjecie.setUrl(zdjecieDetail.getUrl());
                    newZdjecie.setOpis(zdjecieDetail.getOpis());
                    newZdjecie.setProdukt(produkt);
                    produkt.getZdjeciaEntities().add(newZdjecie); // Add to collection for cascade save
                }
            }
        }

        // First save for relations
        Produkt savedProdukt = produktRepository.save(produkt);

        // Update JSON fields
        try {
            List<Integer> finalSkladnikiIds = savedProdukt.getSkladnikiEntities().stream().map(Skladnik::getId).collect(Collectors.toList());
            savedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(finalSkladnikiIds));

            List<Integer> finalZdjeciaIds = savedProdukt.getZdjeciaEntities().stream().map(Zdjecie::getId).collect(Collectors.toList());
            savedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(finalZdjeciaIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing IDs to JSON during update", e);
        }

        // Second save for JSON fields
        return produktRepository.save(savedProdukt);
    }


    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
        // Explicitly delete related Zdjecia if cascade isn't fully trusted or for specific logic
        // List<Zdjecie> zdjeciaToDelete = zdjecieRepository.findByProduktId(id);
        // zdjecieRepository.deleteAll(zdjeciaToDelete);
        produktRepository.delete(produkt); // Cascade should handle Zdjecia due to orphanRemoval=true
                                        // and Produkt_Skladnik join table entries
    }
}

