package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.*;
import com.auth.jwt.data.repository.app_data.*;
import com.auth.jwt.exception.ResourceNotFoundException;
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
                          SkladnikService skladnikService) {
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

        // Handle related entities that must exist by ID
        if (produkt.getRodzajProduktu() != null && produkt.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produkt.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found with ID: " + produkt.getRodzajProduktu().getId())));
        } else {
            produkt.setRodzajProduktu(null);
        }
        if (produkt.getJednostka() != null && produkt.getJednostka().getId() != null) {
            produkt.setJednostka(jednostkaRepository.findById(produkt.getJednostka().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jednostka not found with ID: " + produkt.getJednostka().getId())));
        } else {
            produkt.setJednostka(null);
        }
        if (produkt.getNadKategoria() != null && produkt.getNadKategoria().getId() != null) {
            produkt.setNadKategoria(nadKategoriaRepository.findById(produkt.getNadKategoria().getId())
                .orElseThrow(() -> new ResourceNotFoundException("NadKategoria not found with ID: " + produkt.getNadKategoria().getId())));
        } else {
            produkt.setNadKategoria(null);
        }
        if (produkt.getOpakowanie() != null && produkt.getOpakowanie().getId() != null) {
            produkt.setOpakowanie(opakowanieRepository.findById(produkt.getOpakowanie().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Opakowanie not found with ID: " + produkt.getOpakowanie().getId())));
        } else {
            produkt.setOpakowanie(null);
        }
        if (produkt.getStawkaVat() != null && produkt.getStawkaVat().getId() != null) {
            produkt.setStawkaVat(stawkaVatRepository.findById(produkt.getStawkaVat().getId())
                .orElseThrow(() -> new ResourceNotFoundException("StawkaVat not found with ID: " + produkt.getStawkaVat().getId())));
        } else {
            produkt.setStawkaVat(null);
        }

        // Handle KodTowaru: by ID if provided, else by kod, else create new
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
                 produkt.setKodTowaru(null); // No ID or Kod provided for KodTowaru
            }
        } else {
            produkt.setKodTowaru(null); // No KodTowaru in request
        }

        // Handle KodEan: by ID if provided, else by kod, else create new
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
                produkt.setKodEan(null); // No ID or Kod provided for KodEan
            }
        } else {
            produkt.setKodEan(null); // No KodEan in request
        }

        // Handle Identyfikator: by ID if provided, else by wartosc, else create new
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
                produkt.setIdentyfikator(null); // No ID or Wartosc provided for Identyfikator
            }
        } else {
            produkt.setIdentyfikator(null); // No Identyfikator in request
        }

        // Handle Skladniki
        if (produkt.getSkladniki() != null && !produkt.getSkladniki().isEmpty()) {
            Set<Skladnik> managedSkladniki = new HashSet<>();
            for (Skladnik skladnikDetails : produkt.getSkladniki()) {
                if (skladnikDetails.getId() != null) {
                    Skladnik foundSkladnik = skladnikRepository.findById(skladnikDetails.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found with id: " + skladnikDetails.getId()));
                    managedSkladniki.add(foundSkladnik);
                } else if (skladnikDetails.getNazwa() != null) {
                    Optional<Skladnik> existingSkladnik = skladnikRepository.findByNazwa(skladnikDetails.getNazwa());
                    if (existingSkladnik.isPresent()) {
                        managedSkladniki.add(existingSkladnik.get());
                    } else {
                        // Ensure the new skladnik is saved and managed by SkladnikService
                        managedSkladniki.add(skladnikService.createSkladnik(skladnikDetails));
                    }
                }
            }
            produkt.setSkladniki(managedSkladniki);
        } else {
            produkt.setSkladniki(new HashSet<>()); // Ensure it's an empty set if null or empty initially
        }

        // Prepare Zdjecia for cascade save
        if (produkt.getZdjecia() != null && !produkt.getZdjecia().isEmpty()) {
            List<Zdjecie> processedZdjecia = new ArrayList<>();
            for (Zdjecie zdjecie : produkt.getZdjecia()) {
                zdjecie.setId(null); // Ensure it's treated as new
                zdjecie.setProdukt(produkt); // Set the bi-directional relationship
                processedZdjecia.add(zdjecie); // Add to a list that will be set on the produkt
            }
            produkt.setZdjecia(processedZdjecia);
        } else {
            produkt.setZdjecia(new ArrayList<>());
        }

        Produkt savedProdukt = produktRepository.save(produkt);
        return savedProdukt;
    }

    @Transactional("appDataTransactionManager")
    public Produkt updateProdukt(Integer id, Produkt produktDetails) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

        // Basic fields update
        if (produktDetails.getNazwa() != null && !produktDetails.getNazwa().equals(produkt.getNazwa())) {
            produktRepository.findByNazwa(produktDetails.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Produkt o nazwie '" + produktDetails.getNazwa() + "' już istnieje.");
                }
            });
            produkt.setNazwa(produktDetails.getNazwa());
        }
        // ... (other basic fields update as before)
        if (produktDetails.getWaga() != null) produkt.setWaga(produktDetails.getWaga());
        if (produktDetails.getCena() != null) produkt.setCena(produktDetails.getCena());
        produkt.setSuperProdukt(produktDetails.getSuperProdukt());
        produkt.setTowarPolecany(produktDetails.getTowarPolecany());
        produkt.setRekomendacjaSprzedawcy(produktDetails.getRekomendacjaSprzedawcy());
        produkt.setSuperCena(produktDetails.getSuperCena());
        produkt.setNowosc(produktDetails.getNowosc());
        produkt.setSuperjakosc(produktDetails.getSuperjakosc());
        produkt.setRabat(produktDetails.getRabat());
        produkt.setDostepny(produktDetails.getDostepny());
        produkt.setDostepneOdReki(produktDetails.getDostepneOdReki());
        produkt.setDostepneDo7Dni(produktDetails.getDostepneDo7Dni());
        produkt.setDostepneNaZamowienie(produktDetails.getDostepneNaZamowienie());
        produkt.setWartoKupic(produktDetails.getWartoKupic());
        produkt.setBezglutenowy(produktDetails.getBezglutenowy());
        if (produktDetails.getOpis() != null) produkt.setOpis(produktDetails.getOpis());

        // Update logic for related entities (similar to create, but for update context)
        // RodzajProduktu, Jednostka, NadKategoria, Opakowanie, StawkaVat - fetch by ID if provided
        if (produktDetails.getRodzajProduktu() != null && produktDetails.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produktDetails.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found")));
        } else if (produktDetails.getRodzajProduktu() != null) { // If object is there but no ID, means clear it or handle differently
             produkt.setRodzajProduktu(null);
        }
        // Similar updates for Jednostka, NadKategoria, Opakowanie, StawkaVat

        // KodTowaru, KodEan, Identyfikator - fetch by ID, or by key, or create/update
        // Example for KodTowaru in update:
        if (produktDetails.getKodTowaru() != null) {
            KodTowaru inputKt = produktDetails.getKodTowaru();
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
            }
        } else {
            produkt.setKodTowaru(null); // If null in details, remove existing
        }
        // Similar updates for KodEan, Identyfikator

        // Skladniki update
        if (produktDetails.getSkladniki() != null) {
            Set<Skladnik> managedSkladniki = new HashSet<>();
            for (Skladnik skladnikDetail : produktDetails.getSkladniki()) {
                if (skladnikDetail.getId() != null) {
                    managedSkladniki.add(skladnikRepository.findById(skladnikDetail.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found with ID: " + skladnikDetail.getId())));
                } else if (skladnikDetail.getNazwa() != null) {
                     Optional<Skladnik> existingSkladnik = skladnikRepository.findByNazwa(skladnikDetail.getNazwa());
                    if (existingSkladnik.isPresent()) {
                        managedSkladniki.add(existingSkladnik.get());
                    } else {
                        managedSkladniki.add(skladnikService.createSkladnik(skladnikDetail));
                    }
                }
            }
            produkt.getSkladniki().clear();
            produkt.getSkladniki().addAll(managedSkladniki);
        }

        // Zdjecia update logic
        if (produktDetails.getZdjecia() != null) {
            // Clear existing zdjecia associated with the produkt
            List<Zdjecie> oldZdjecia = zdjecieRepository.findByProduktId(produkt.getId());
            if (oldZdjecia != null && !oldZdjecia.isEmpty()) {
                zdjecieRepository.deleteAll(oldZdjecia); // This might be too aggressive if you want to update existing ones
                                                      // A more nuanced approach would be to compare IDs and update/delete/add.
            }
            produkt.getZdjecia().clear(); // Clear the collection on the Produkt entity

            List<Zdjecie> newZdjeciaList = new ArrayList<>();
            for (Zdjecie zdjecieDetail : produktDetails.getZdjecia()) {
                zdjecieDetail.setId(null); // Treat as new for simplicity in update, or implement find/update logic
                zdjecieDetail.setProdukt(produkt);
                newZdjeciaList.add(zdjecieRepository.save(zdjecieDetail)); // Save each new/updated Zdjecie
            }
            produkt.setZdjecia(newZdjeciaList);
        } else {
            // If produktDetails.getZdjecia() is null, it might mean no changes or remove all.
            // To remove all if null: 
            // List<Zdjecie> zdjeciaToDelete = zdjecieRepository.findByProduktId(produkt.getId());
            // if (zdjeciaToDelete != null && !zdjeciaToDelete.isEmpty()) { zdjecieRepository.deleteAll(zdjeciaToDelete); }
            // produkt.setZdjecia(new ArrayList<>());
        }

        return produktRepository.save(produkt);
    }

    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        Produkt produkt = produktRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
        // Explicitly delete related Zdjecia if not handled by cascade on DB or orphanRemoval isn't enough
        List<Zdjecie> zdjeciaToDelete = zdjecieRepository.findByProduktId(id);
        if (zdjeciaToDelete != null && !zdjeciaToDelete.isEmpty()) {
            zdjecieRepository.deleteAll(zdjeciaToDelete);
        }
        produktRepository.delete(produkt);
    }
}

