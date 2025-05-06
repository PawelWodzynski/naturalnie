package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.*;
import com.auth.jwt.data.repository.app_data.*;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList; // Added import
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

        // Handle related entities that must exist
        if (produkt.getRodzajProduktu() != null && produkt.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produkt.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found with ID: " + produkt.getRodzajProduktu().getId())));
        } else {
            produkt.setRodzajProduktu(null); // Or throw error if required
        }
        if (produkt.getJednostka() != null && produkt.getJednostka().getId() != null) {
            produkt.setJednostka(jednostkaRepository.findById(produkt.getJednostka().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jednostka not found with ID: " + produkt.getJednostka().getId())));
        } else {
            produkt.setJednostka(null); // Or throw error if required
        }
        if (produkt.getNadKategoria() != null && produkt.getNadKategoria().getId() != null) {
            produkt.setNadKategoria(nadKategoriaRepository.findById(produkt.getNadKategoria().getId())
                .orElseThrow(() -> new ResourceNotFoundException("NadKategoria not found with ID: " + produkt.getNadKategoria().getId())));
        } else {
            produkt.setNadKategoria(null); // Or throw error if required
        }
        if (produkt.getOpakowanie() != null && produkt.getOpakowanie().getId() != null) {
            produkt.setOpakowanie(opakowanieRepository.findById(produkt.getOpakowanie().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Opakowanie not found with ID: " + produkt.getOpakowanie().getId())));
        } else {
            produkt.setOpakowanie(null); // Or throw error if required
        }
        if (produkt.getStawkaVat() != null && produkt.getStawkaVat().getId() != null) {
            produkt.setStawkaVat(stawkaVatRepository.findById(produkt.getStawkaVat().getId())
                .orElseThrow(() -> new ResourceNotFoundException("StawkaVat not found with ID: " + produkt.getStawkaVat().getId())));
        } else {
            produkt.setStawkaVat(null); // Or throw error if required
        }

        // Handle KodTowaru: find by kod or create new
        if (produkt.getKodTowaru() != null && produkt.getKodTowaru().getKod() != null) {
            Optional<KodTowaru> existingKt = kodTowaruRepository.findByKod(produkt.getKodTowaru().getKod());
            if (existingKt.isPresent()) {
                produkt.setKodTowaru(existingKt.get());
            } else {
                KodTowaru newKodTowaru = produkt.getKodTowaru();
                newKodTowaru.setId(null); // Ensure it's treated as new
                produkt.setKodTowaru(kodTowaruRepository.save(newKodTowaru));
            }
        } else {
            produkt.setKodTowaru(null); // Set to null if not provided or no kod
        }

        // Handle KodEan: find by kod or create new
        if (produkt.getKodEan() != null && produkt.getKodEan().getKod() != null) {
            Optional<KodEan> existingKe = kodEanRepository.findByKod(produkt.getKodEan().getKod());
            if (existingKe.isPresent()) {
                produkt.setKodEan(existingKe.get());
            } else {
                KodEan newKodEan = produkt.getKodEan();
                newKodEan.setId(null); // Ensure it's treated as new
                produkt.setKodEan(kodEanRepository.save(newKodEan));
            }
        } else {
            produkt.setKodEan(null); // Set to null if not provided or no kod
        }

        // Handle Identyfikator: find by wartosc or create new
        if (produkt.getIdentyfikator() != null && produkt.getIdentyfikator().getWartosc() != null) {
            Optional<Identyfikator> existingId = identyfikatorRepository.findByWartosc(produkt.getIdentyfikator().getWartosc());
            if (existingId.isPresent()) {
                produkt.setIdentyfikator(existingId.get());
            } else {
                Identyfikator newIdentyfikator = produkt.getIdentyfikator();
                newIdentyfikator.setId(null); // Ensure it's treated as new
                produkt.setIdentyfikator(identyfikatorRepository.save(newIdentyfikator));
            }
        } else {
            produkt.setIdentyfikator(null); // Set to null if not provided or no wartosc
        }

        // Handle Skladniki
        if (produkt.getSkladniki() != null && !produkt.getSkladniki().isEmpty()) {
            Set<Skladnik> managedSkladniki = new HashSet<>();
            for (Skladnik skladnik : produkt.getSkladniki()) {
                if (skladnik.getId() != null) {
                    managedSkladniki.add(skladnikRepository.findById(skladnik.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found with id: " + skladnik.getId())));
                } else if (skladnik.getNazwa() != null) {
                    Optional<Skladnik> existingSkladnik = skladnikRepository.findByNazwa(skladnik.getNazwa());
                    if (existingSkladnik.isPresent()) {
                        managedSkladniki.add(existingSkladnik.get());
                    } else {
                        // Pass the Skladnik instance directly to createSkladnik if it's new
                        managedSkladniki.add(skladnikService.createSkladnik(skladnik));
                    }
                }
            }
            produkt.setSkladniki(managedSkladniki);
        }
        
        Produkt savedProdukt = produktRepository.save(produkt);

        // Handle Zdjecia after Produkt is saved
        if (produkt.getZdjecia() != null && !produkt.getZdjecia().isEmpty()) {
            List<Zdjecie> managedZdjecia = produkt.getZdjecia().stream().map(zdjecie -> {
                zdjecie.setProdukt(savedProdukt); // Link to the saved Produkt
                zdjecie.setId(null); // Ensure Zdjecie is treated as new if not already persisted with Produkt
                return zdjecieRepository.save(zdjecie);
            }).collect(Collectors.toList());
            savedProdukt.setZdjecia(managedZdjecia); // Corrected: Produkt.zdjecia is List<Zdjecie>
        }

        return savedProdukt;
    }

    @Transactional("appDataTransactionManager")
    public Produkt updateProdukt(Integer id, Produkt produktDetails) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

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
        // ... (other simple field updates)
        produkt.setSuperProdukt(produktDetails.getSuperProdukt());
        produkt.setTowarPolecany(produktDetails.getTowarPolecany());
        produkt.setRekomendacjaSprzedawcy(produktDetails.getRekomendacjaSprzedawcy()); // Corrected typo
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

        // Update logic for related entities - similar careful handling needed as in create
        if (produktDetails.getRodzajProduktu() != null && produktDetails.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produktDetails.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found")));
        } else if (produktDetails.getRodzajProduktu() != null) {
             produkt.setRodzajProduktu(null); // Or handle new RodzajProduktu if applicable
        }

        // KodTowaru, KodEan, Identyfikator updates
        if (produktDetails.getKodTowaru() != null) {
            if (produktDetails.getKodTowaru().getId() != null) {
                produkt.setKodTowaru(kodTowaruRepository.findById(produktDetails.getKodTowaru().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("KodTowaru not found")));
            } else if (produktDetails.getKodTowaru().getKod() != null) {
                Optional<KodTowaru> existingKt = kodTowaruRepository.findByKod(produktDetails.getKodTowaru().getKod());
                if (existingKt.isPresent()) {
                    produkt.setKodTowaru(existingKt.get());
                } else {
                    KodTowaru newKt = produktDetails.getKodTowaru();
                    newKt.setId(null);
                    produkt.setKodTowaru(kodTowaruRepository.save(newKt));
                }
            }
        } else {
            produkt.setKodTowaru(null);
        }
        // Similar for KodEan and Identyfikator
         if (produktDetails.getKodEan() != null) {
            if (produktDetails.getKodEan().getId() != null) {
                produkt.setKodEan(kodEanRepository.findById(produktDetails.getKodEan().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("KodEan not found")));
            } else if (produktDetails.getKodEan().getKod() != null) {
                Optional<KodEan> existingKe = kodEanRepository.findByKod(produktDetails.getKodEan().getKod());
                if (existingKe.isPresent()) {
                    produkt.setKodEan(existingKe.get());
                } else {
                    KodEan newKe = produktDetails.getKodEan();
                    newKe.setId(null);
                    produkt.setKodEan(kodEanRepository.save(newKe));
                }
            }
        } else {
            produkt.setKodEan(null);
        }

        if (produktDetails.getIdentyfikator() != null) {
            if (produktDetails.getIdentyfikator().getId() != null) {
                produkt.setIdentyfikator(identyfikatorRepository.findById(produktDetails.getIdentyfikator().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Identyfikator not found")));
            } else if (produktDetails.getIdentyfikator().getWartosc() != null) {
                Optional<Identyfikator> existingId = identyfikatorRepository.findByWartosc(produktDetails.getIdentyfikator().getWartosc());
                if (existingId.isPresent()) {
                    produkt.setIdentyfikator(existingId.get());
                } else {
                    Identyfikator newId = produktDetails.getIdentyfikator();
                    newId.setId(null);
                    produkt.setIdentyfikator(identyfikatorRepository.save(newId));
                }
            }
        } else {
            produkt.setIdentyfikator(null);
        }


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
            // Remove old images not present in the new list
            List<Integer> newImageIds = produktDetails.getZdjecia().stream()
                                схожі.map(Zdjecie::getId)
                                .filter(imgId -> imgId != null)
                                .collect(Collectors.toList());
            if (!newImageIds.isEmpty()) {
                zdjecieRepository.deleteByProduktIdAndIdNotIn(produkt.getId(), newImageIds);
            } else {
                 // If newImageIds is empty, delete all existing images for this product
                List<Zdjecie> zdjeciaToDelete = zdjecieRepository.findByProduktId(produkt.getId());
                if (zdjeciaToDelete != null && !zdjeciaToDelete.isEmpty()) {
                    zdjecieRepository.deleteAll(zdjeciaToDelete);
                }
            }

            List<Zdjecie> newZdjeciaList = new ArrayList<>();
            for (Zdjecie zdjecieDetail : produktDetails.getZdjecia()) {
                zdjecieDetail.setProdukt(produkt);
                // If zdjecieDetail has an ID, it might be an existing image to update.
                // If ID is null, it's a new image.
                // save() will handle both update and create.
                newZdjeciaList.add(zdjecieRepository.save(zdjecieDetail));
            }
            produkt.setZdjecia(newZdjeciaList); // Corrected: Produkt.zdjecia is List<Zdjecie>
        } else {
            // If produktDetails.getZdjecia() is null, it might mean no changes or remove all.
            // For now, let's assume it means no changes to existing images unless explicitly cleared.
            // If the intent is to remove all images, the list should be empty, not null.
            // If produktDetails.getZdjecia() is an empty list, the logic above will delete all images.
        }

        return produktRepository.save(produkt);
    }

    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        Produkt produkt = produktRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
        // Explicitly delete Zdjecia associated with this Produkt before deleting the Produkt
        // This is good practice if orphanRemoval=true is not fully relied upon or if specific logic is needed.
        List<Zdjecie> zdjeciaToDelete = zdjecieRepository.findByProduktId(id);
        if (zdjeciaToDelete != null && !zdjeciaToDelete.isEmpty()) {
            zdjecieRepository.deleteAll(zdjeciaToDelete);
        }
        produktRepository.delete(produkt);
    }
}

