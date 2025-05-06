package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.*;
import com.auth.jwt.data.repository.app_data.*;
import com.auth.jwt.dto.app_data.ProduktRequestDTO;
import com.auth.jwt.dto.app_data.ZdjecieRequestDTO;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Produkt createProdukt(ProduktRequestDTO dto) {
        if (produktRepository.findByNazwa(dto.getNazwa()).isPresent()) {
            throw new IllegalArgumentException("Produkt o nazwie '" + dto.getNazwa() + "' ju	 istnieje.");
        }

        Produkt produkt = new Produkt();
        // Map direct fields from DTO
        produkt.setNazwa(dto.getNazwa());
        produkt.setWaga(dto.getWaga());
        produkt.setCena(dto.getCena());
        produkt.setSuperProdukt(dto.getSuperProdukt() != null ? dto.getSuperProdukt() : false);
        produkt.setTowarPolecany(dto.getTowarPolecany() != null ? dto.getTowarPolecany() : false);
        produkt.setRekomendacjaSprzedawcy(dto.getRekomendacjaSprzedawcy() != null ? dto.getRekomendacjaSprzedawcy() : false);
        produkt.setSuperCena(dto.getSuperCena() != null ? dto.getSuperCena() : false);
        produkt.setNowosc(dto.getNowosc() != null ? dto.getNowosc() : false);
        produkt.setSuperjakosc(dto.getSuperjakosc() != null ? dto.getSuperjakosc() : false);
        produkt.setRabat(dto.getRabat() != null ? dto.getRabat() : false);
        produkt.setDostepny(dto.getDostepny() != null ? dto.getDostepny() : true);
        produkt.setDostepneOdReki(dto.getDostepneOdReki() != null ? dto.getDostepneOdReki() : false);
        produkt.setDostepneDo7Dni(dto.getDostepneDo7Dni() != null ? dto.getDostepneDo7Dni() : false);
        produkt.setDostepneNaZamowienie(dto.getDostepneNaZamowienie() != null ? dto.getDostepneNaZamowienie() : false);
        produkt.setWartoKupic(dto.getWartoKupic() != null ? dto.getWartoKupic() : false);
        produkt.setBezglutenowy(dto.getBezglutenowy() != null ? dto.getBezglutenowy() : false);
        produkt.setOpis(dto.getOpis());

        // Handle simple relations by ID from DTO
        if (dto.getRodzajProduktuId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(dto.getRodzajProduktuId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found with ID: " + dto.getRodzajProduktuId())));
        }
        if (dto.getJednostkaId() != null) {
            produkt.setJednostka(jednostkaRepository.findById(dto.getJednostkaId())
                .orElseThrow(() -> new ResourceNotFoundException("Jednostka not found with ID: " + dto.getJednostkaId())));
        }
        if (dto.getNadKategoriaId() != null) {
            produkt.setNadKategoria(nadKategoriaRepository.findById(dto.getNadKategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("NadKategoria not found with ID: " + dto.getNadKategoriaId())));
        }
        if (dto.getOpakowanieId() != null) {
            produkt.setOpakowanie(opakowanieRepository.findById(dto.getOpakowanieId())
                .orElseThrow(() -> new ResourceNotFoundException("Opakowanie not found with ID: " + dto.getOpakowanieId())));
        }
        if (dto.getStawkaVatId() != null) {
            produkt.setStawkaVat(stawkaVatRepository.findById(dto.getStawkaVatId())
                .orElseThrow(() -> new ResourceNotFoundException("StawkaVat not found with ID: " + dto.getStawkaVatId())));
        }

        // Handle KodTowaru, KodEan, Identyfikator (find or create)
        if (dto.getKodTowaruKod() != null) {
            KodTowaru kt = kodTowaruRepository.findByKod(dto.getKodTowaruKod())
                .orElseGet(() -> {
                    KodTowaru newKt = new KodTowaru();
                    newKt.setKod(dto.getKodTowaruKod());
                    return kodTowaruRepository.save(newKt);
                });
            produkt.setKodTowaru(kt);
        }
        if (dto.getKodEanKod() != null) {
            KodEan ke = kodEanRepository.findByKod(dto.getKodEanKod())
                .orElseGet(() -> {
                    KodEan newKe = new KodEan();
                    newKe.setKod(dto.getKodEanKod());
                    return kodEanRepository.save(newKe);
                });
            produkt.setKodEan(ke);
        }
        if (dto.getIdentyfikatorWartosc() != null) {
            Identyfikator idf = identyfikatorRepository.findByWartosc(dto.getIdentyfikatorWartosc())
                .orElseGet(() -> {
                    Identyfikator newIdf = new Identyfikator();
                    newIdf.setWartosc(dto.getIdentyfikatorWartosc());
                    return identyfikatorRepository.save(newIdf);
                });
            produkt.setIdentyfikator(idf);
        }

        // Save Produkt first to get its ID (without SkladnikiEntities and ZdjeciaEntities yet)
        Produkt savedProdukt = produktRepository.save(produkt);

        // Handle Skladniki
        Set<Skladnik> managedSkladniki = new HashSet<>();
        List<Integer> skladnikiIds = new ArrayList<>();
        if (dto.getSkladniki() != null && !dto.getSkladniki().isEmpty()) {
            for (String nazwaSkladnika : dto.getSkladniki()) {
                Skladnik skladnik = skladnikRepository.findByNazwa(nazwaSkladnika)
                    .orElseGet(() -> {
                        Skladnik newSkladnik = new Skladnik();
                        newSkladnik.setNazwa(nazwaSkladnika);
                        return skladnikRepository.save(newSkladnik);
                    });
                managedSkladniki.add(skladnik);
                skladnikiIds.add(skladnik.getId());
            }
        }
        savedProdukt.setSkladnikiEntities(managedSkladniki); // Set entities for join table
        try {
            savedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Skladnik IDs to JSON", e);
        }

        // Handle Zdjecia
        List<Zdjecie> managedZdjecia = new ArrayList<>();
        List<Integer> zdjeciaIds = new ArrayList<>();
        if (dto.getZdjecia() != null && !dto.getZdjecia().isEmpty()) {
            for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                Zdjecie zdjecie = new Zdjecie();
                zdjecie.setDaneZdjecia(zdjecieDto.getDaneZdjecia());
                zdjecie.setOpis(zdjecieDto.getOpis());
                zdjecie.setKolejnosc(zdjecieDto.getKolejnosc());
                zdjecie.setProdukt(savedProdukt); // Link to the saved Produkt
                Zdjecie savedZdjecie = zdjecieRepository.save(zdjecie); // Save each Zdjecie
                managedZdjecia.add(savedZdjecie);
                zdjeciaIds.add(savedZdjecie.getId());
            }
        }
        savedProdukt.setZdjeciaEntities(managedZdjecia); // Set entities for relation
        try {
            savedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(zdjeciaIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Zdjecie IDs to JSON", e);
        }

        // Final save of Produkt with Skladniki JSON, Zdjecia JSON, and SkladnikiEntities join table populated
        return produktRepository.save(savedProdukt);
    }

    @Transactional("appDataTransactionManager")
    public Produkt updateProdukt(Integer id, ProduktRequestDTO dto) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

        // Check for name uniqueness if changed
        if (dto.getNazwa() != null && !dto.getNazwa().equals(produkt.getNazwa())) {
            produktRepository.findByNazwa(dto.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Produkt o nazwie '" + dto.getNazwa() + "' ju	 istnieje.");
                }
            });
            produkt.setNazwa(dto.getNazwa());
        }

        // Map direct fields
        if(dto.getWaga() != null) produkt.setWaga(dto.getWaga());
        if(dto.getCena() != null) produkt.setCena(dto.getCena());
        if(dto.getSuperProdukt() != null) produkt.setSuperProdukt(dto.getSuperProdukt());
        if(dto.getTowarPolecany() != null) produkt.setTowarPolecany(dto.getTowarPolecany());
        if(dto.getRekomendacjaSprzedawcy() != null) produkt.setRekomendacjaSprzedawcy(dto.getRekomendacjaSprzedawcy());
        if(dto.getSuperCena() != null) produkt.setSuperCena(dto.getSuperCena());
        if(dto.getNowosc() != null) produkt.setNowosc(dto.getNowosc());
        if(dto.getSuperjakosc() != null) produkt.setSuperjakosc(dto.getSuperjakosc());
        if(dto.getRabat() != null) produkt.setRabat(dto.getRabat());
        if(dto.getDostepny() != null) produkt.setDostepny(dto.getDostepny());
        if(dto.getDostepneOdReki() != null) produkt.setDostepneOdReki(dto.getDostepneOdReki());
        if(dto.getDostepneDo7Dni() != null) produkt.setDostepneDo7Dni(dto.getDostepneDo7Dni());
        if(dto.getDostepneNaZamowienie() != null) produkt.setDostepneNaZamowienie(dto.getDostepneNaZamowienie());
        if(dto.getWartoKupic() != null) produkt.setWartoKupic(dto.getWartoKupic());
        if(dto.getBezglutenowy() != null) produkt.setBezglutenowy(dto.getBezglutenowy());
        if(dto.getOpis() != null) produkt.setOpis(dto.getOpis());

        // Update simple relations by ID
        if (dto.getRodzajProduktuId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(dto.getRodzajProduktuId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found with ID: " + dto.getRodzajProduktuId())));
        } else {
            produkt.setRodzajProduktu(null);
        }
        // ... (similar for Jednostka, NadKategoria, Opakowanie, StawkaVat)
        if (dto.getJednostkaId() != null) {
            produkt.setJednostka(jednostkaRepository.findById(dto.getJednostkaId())
                .orElseThrow(() -> new ResourceNotFoundException("Jednostka not found with ID: " + dto.getJednostkaId())));
        } else {
            produkt.setJednostka(null);
        }
        if (dto.getNadKategoriaId() != null) {
            produkt.setNadKategoria(nadKategoriaRepository.findById(dto.getNadKategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("NadKategoria not found with ID: " + dto.getNadKategoriaId())));
        } else {
            produkt.setNadKategoria(null);
        }
        if (dto.getOpakowanieId() != null) {
            produkt.setOpakowanie(opakowanieRepository.findById(dto.getOpakowanieId())
                .orElseThrow(() -> new ResourceNotFoundException("Opakowanie not found with ID: " + dto.getOpakowanieId())));
        } else {
            produkt.setOpakowanie(null);
        }
        if (dto.getStawkaVatId() != null) {
            produkt.setStawkaVat(stawkaVatRepository.findById(dto.getStawkaVatId())
                .orElseThrow(() -> new ResourceNotFoundException("StawkaVat not found with ID: " + dto.getStawkaVatId())));
        } else {
            produkt.setStawkaVat(null);
        }

        // Update KodTowaru, KodEan, Identyfikator (find or create/update)
        if (dto.getKodTowaruKod() != null) {
            KodTowaru kt = kodTowaruRepository.findByKod(dto.getKodTowaruKod())
                .orElseGet(() -> {
                    KodTowaru newKt = new KodTowaru();
                    newKt.setKod(dto.getKodTowaruKod());
                    return kodTowaruRepository.save(newKt);
                });
            produkt.setKodTowaru(kt);
        } else {
            produkt.setKodTowaru(null);
        }
        // ... (similar for KodEan, Identyfikator)
         if (dto.getKodEanKod() != null) {
            KodEan ke = kodEanRepository.findByKod(dto.getKodEanKod())
                .orElseGet(() -> {
                    KodEan newKe = new KodEan();
                    newKe.setKod(dto.getKodEanKod());
                    return kodEanRepository.save(newKe);
                });
            produkt.setKodEan(ke);
        } else {
            produkt.setKodEan(null);
        }
        if (dto.getIdentyfikatorWartosc() != null) {
            Identyfikator idf = identyfikatorRepository.findByWartosc(dto.getIdentyfikatorWartosc())
                .orElseGet(() -> {
                    Identyfikator newIdf = new Identyfikator();
                    newIdf.setWartosc(dto.getIdentyfikatorWartosc());
                    return identyfikatorRepository.save(newIdf);
                });
            produkt.setIdentyfikator(idf);
        } else {
            produkt.setIdentyfikator(null);
        }

        // Update Skladniki
        Set<Skladnik> updatedSkladniki = new HashSet<>();
        List<Integer> updatedSkladnikiIds = new ArrayList<>();
        if (dto.getSkladniki() != null) { // Allow empty list to clear skladniki
            for (String nazwaSkladnika : dto.getSkladniki()) {
                Skladnik skladnik = skladnikRepository.findByNazwa(nazwaSkladnika)
                    .orElseGet(() -> {
                        Skladnik newSkladnik = new Skladnik();
                        newSkladnik.setNazwa(nazwaSkladnika);
                        return skladnikRepository.save(newSkladnik);
                    });
                updatedSkladniki.add(skladnik);
                updatedSkladnikiIds.add(skladnik.getId());
            }
        }
        produkt.getSkladnikiEntities().clear();
        produkt.getSkladnikiEntities().addAll(updatedSkladniki);
        try {
            produkt.setSkladnikiJson(objectMapper.writeValueAsString(updatedSkladnikiIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Skladnik IDs to JSON for update", e);
        }

        // Update Zdjecia
        // First, remove old images not present in the new list (if any)
        // This requires careful handling if IDs are provided for existing images vs new binary data
        // For simplicity in this refactor, we'll clear existing and add new ones based on DTO.
        // A more sophisticated approach would compare existing image IDs with IDs in DTO (if DTO supported it)
        // or use a more complex DTO structure for updates.

        // Clear existing ZdjeciaEntities linked to this Produkt from the join table and Zdjecie table
        // This is a bit aggressive; a more nuanced update would be better in a real app.
        if (produkt.getZdjeciaEntities() != null) {
             zdjecieRepository.deleteAll(produkt.getZdjeciaEntities()); // Delete old images from DB
             produkt.getZdjeciaEntities().clear(); // Clear the collection in the entity
        }
        
        List<Zdjecie> updatedZdjeciaEntities = new ArrayList<>();
        List<Integer> updatedZdjeciaIds = new ArrayList<>();
        if (dto.getZdjecia() != null && !dto.getZdjecia().isEmpty()) {
            for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                Zdjecie zdjecie = new Zdjecie();
                zdjecie.setDaneZdjecia(zdjecieDto.getDaneZdjecia());
                zdjecie.setOpis(zdjecieDto.getOpis());
                zdjecie.setKolejnosc(zdjecieDto.getKolejnosc());
                zdjecie.setProdukt(produkt); // Link to the current Produkt
                Zdjecie savedZdjecie = zdjecieRepository.save(zdjecie); // Save each new Zdjecie
                updatedZdjeciaEntities.add(savedZdjecie);
                updatedZdjeciaIds.add(savedZdjecie.getId());
            }
        }
        produkt.setZdjeciaEntities(updatedZdjeciaEntities);
        try {
            produkt.setZdjeciaJson(objectMapper.writeValueAsString(updatedZdjeciaIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Zdjecie IDs to JSON for update", e);
        }

        return produktRepository.save(produkt);
    }

    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
        // Related entities like Zdjecie with CascadeType.ALL on Produkt.zdjeciaEntities will be deleted by JPA.
        // Skladniki join table entries will also be handled by JPA for ManyToMany.
        // Explicit deletion of Zdjecia was removed as cascade should handle it.
        produktRepository.delete(produkt);
    }
}

