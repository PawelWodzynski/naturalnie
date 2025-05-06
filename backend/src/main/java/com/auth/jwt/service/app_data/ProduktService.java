package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.*;
import com.auth.jwt.data.repository.app_data.*;
import com.auth.jwt.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // Services for creating related entities if they don't exist
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
        this.skladnikService = skladnikService; // Inject SkladnikService
    }

    public List<Produkt> getAllProdukty() {
        return produktRepository.findAll();
    }

    public Optional<Produkt> getProduktById(Integer id) {
        return produktRepository.findById(id);
    }

    @Transactional
    public Produkt createProdukt(Produkt produkt) {
        // Check for Produkt duplicate by nazwa
        if (produktRepository.findByNazwa(produkt.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("Produkt o nazwie '" + produkt.getNazwa() + "' już istnieje.");
        }

        // Handle related entities - fetch if ID provided, otherwise assume they are new or transient
        // For simple ManyToOne/OneToOne, if an ID is provided, we assume it exists.
        // If a full object is provided without ID, it might be a new entity to persist (cascade might handle this if configured)

        if (produkt.getRodzajProduktu() != null && produkt.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produkt.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found")));
        }
        if (produkt.getJednostka() != null && produkt.getJednostka().getId() != null) {
            produkt.setJednostka(jednostkaRepository.findById(produkt.getJednostka().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Jednostka not found")));
        }
        if (produkt.getNadKategoria() != null && produkt.getNadKategoria().getId() != null) {
            produkt.setNadKategoria(nadKategoriaRepository.findById(produkt.getNadKategoria().getId())
                .orElseThrow(() -> new ResourceNotFoundException("NadKategoria not found")));
        }
        if (produkt.getOpakowanie() != null && produkt.getOpakowanie().getId() != null) {
            produkt.setOpakowanie(opakowanieRepository.findById(produkt.getOpakowanie().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Opakowanie not found")));
        }
        if (produkt.getStawkaVat() != null && produkt.getStawkaVat().getId() != null) {
            produkt.setStawkaVat(stawkaVatRepository.findById(produkt.getStawkaVat().getId())
                .orElseThrow(() -> new ResourceNotFoundException("StawkaVat not found")));
        }

        // For OneToOne with cascade, if the object is new, it should be persisted with the Produkt.
        // If KodTowaru, KodEan, Identyfikator are new and need to be unique, their services should handle creation and duplicate checks.
        // For simplicity, we assume they are either new (and cascaded) or existing (and pre-set with ID).
        // If they are new and have unique constraints, ensure they are persisted first or handled by cascade.
        if (produkt.getKodTowaru() != null && produkt.getKodTowaru().getKod() != null) {
            Optional<KodTowaru> existingKt = kodTowaruRepository.findByKod(produkt.getKodTowaru().getKod());
            if (existingKt.isPresent()) produkt.setKodTowaru(existingKt.get());
            // else it's new and will be cascaded if CascadeType.PERSIST or ALL is set on Produkt.kodTowaru
        }
        if (produkt.getKodEan() != null && produkt.getKodEan().getKod() != null) {
            Optional<KodEan> existingKe = kodEanRepository.findByKod(produkt.getKodEan().getKod());
            if (existingKe.isPresent()) produkt.setKodEan(existingKe.get());
        }
        if (produkt.getIdentyfikator() != null && produkt.getIdentyfikator().getWartosc() != null) {
            Optional<Identyfikator> existingId = identyfikatorRepository.findByWartosc(produkt.getIdentyfikator().getWartosc());
            if (existingId.isPresent()) produkt.setIdentyfikator(existingId.get());
        }

        // Handle Skladniki (ManyToMany)
        if (produkt.getSkladniki() != null && !produkt.getSkladniki().isEmpty()) {
            Set<Skladnik> managedSkladniki = new HashSet<>();
            for (Skladnik skladnik : produkt.getSkladniki()) {
                if (skladnik.getId() != null) {
                    managedSkladniki.add(skladnikRepository.findById(skladnik.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found with id: " + skladnik.getId())));
                } else if (skladnik.getNazwa() != null) {
                    // Try to find by name, or create if not exists (using SkladnikService for duplicate check)
                    Optional<Skladnik> existingSkladnik = skladnikRepository.findByNazwa(skladnik.getNazwa());
                    if (existingSkladnik.isPresent()) {
                        managedSkladniki.add(existingSkladnik.get());
                    } else {
                        // Create new Skladnik via SkladnikService to ensure its own duplicate checks are run
                        managedSkladniki.add(skladnikService.createSkladnik(new Skladnik(skladnik.getNazwa())));
                    }
                }
            }
            produkt.setSkladniki(managedSkladniki);
        }
        
        // Save Produkt first to get an ID for Zdjecia
        Produkt savedProdukt = produktRepository.save(produkt);

        // Handle Zdjecia (OneToMany) - associate them with the saved Produkt
        if (produkt.getZdjecia() != null && !produkt.getZdjecia().isEmpty()) {
            List<Zdjecie> managedZdjecia = produkt.getZdjecia().stream().map(zdjecie -> {
                zdjecie.setProdukt(savedProdukt); // Associate with the saved Produkt
                // If Zdjecie has unique constraints (e.g., URL per product), check here or in ZdjecieService
                // For now, assuming ZdjecieService's create/update handles its own duplicates if necessary.
                return zdjecieRepository.save(zdjecie); // Persist each Zdjecie
            }).collect(Collectors.toList());
            savedProdukt.setZdjecia(managedZdjecia);
        }

        return savedProdukt;
    }

    @Transactional
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

        // Update simple fields
        if (produktDetails.getWaga() != null) produkt.setWaga(produktDetails.getWaga());
        if (produktDetails.getCena() != null) produkt.setCena(produktDetails.getCena());
        if (produktDetails.getSuperProdukt() != null) produkt.setSuperProdukt(produktDetails.getSuperProdukt());
        if (produktDetails.getTowarPolecany() != null) produkt.setTowarPolecany(produktDetails.getTowarPolecany());
        // ... (update other flags and simple fields)
        if (produktDetails.getOpis() != null) produkt.setOpis(produktDetails.getOpis());

        // Update relationships (similar logic to create, but for updates)
        if (produktDetails.getRodzajProduktu() != null && produktDetails.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produktDetails.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found")));
        }
        // ... (update other ManyToOne/OneToOne relationships)

        // Update Skladniki
        if (produktDetails.getSkladniki() != null) {
            Set<Skladnik> managedSkladniki = new HashSet<>();
            for (Skladnik skladnikDetail : produktDetails.getSkladniki()) {
                if (skladnikDetail.getId() != null) {
                    managedSkladniki.add(skladnikRepository.findById(skladnikDetail.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skladnik not found")));
                } else if (skladnikDetail.getNazwa() != null) {
                     Optional<Skladnik> existingSkladnik = skladnikRepository.findByNazwa(skladnikDetail.getNazwa());
                    if (existingSkladnik.isPresent()) {
                        managedSkladniki.add(existingSkladnik.get());
                    } else {
                        managedSkladniki.add(skladnikService.createSkladnik(new Skladnik(skladnikDetail.getNazwa())));
                    }
                }
            }
            produkt.getSkladniki().clear();
            produkt.getSkladniki().addAll(managedSkladniki);
        }

        // Update Zdjecia (more complex: add new, remove old, update existing)
        // This might involve clearing existing and adding new, or more granular updates.
        // For simplicity, if zdjecia are provided, we can replace them.
        if (produktDetails.getZdjecia() != null) {
            // First, remove old images not present in the new list (orphans)
            zdjecieRepository.deleteByProduktIdAndIdNotIn(produkt.getId(), 
                produktDetails.getZdjecia().stream().map(Zdjecie::getId).filter(imgId -> imgId != null).collect(Collectors.toList()));

            List<Zdjecie> updatedZdjecia = produktDetails.getZdjecia().stream().map(zdjecieDetail -> {
                zdjecieDetail.setProdukt(produkt);
                return zdjecieRepository.save(zdjecieDetail); // Save or update
            }).collect(Collectors.toList());
            produkt.setZdjecia(updatedZdjecia);
        }

        return produktRepository.save(produkt);
    }

    @Transactional
    public void deleteProdukt(Integer id) {
        if (!produktRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony.");
        }
        // Related entities with CascadeType.ALL or orphanRemoval=true will be deleted automatically.
        // For others, manual deletion might be needed if not handled by DB constraints or cascades.
        produktRepository.deleteById(id);
    }
}

