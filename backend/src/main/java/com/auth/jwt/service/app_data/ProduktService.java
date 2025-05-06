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
import org.springframework.util.StringUtils;

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

        // Handle RodzajProduktu
        if (StringUtils.hasText(dto.getRodzajProduktuNazwa())) {
            RodzajProduktu rodzajProduktu = rodzajProduktuRepository.findByNazwa(dto.getRodzajProduktuNazwa())
                .orElseGet(() -> {
                    RodzajProduktu newRodzaj = new RodzajProduktu();
                    newRodzaj.setNazwa(dto.getRodzajProduktuNazwa());
                    newRodzaj.setOpis(dto.getRodzajProduktuOpis());
                    // Assuming NadKategoria for RodzajProduktu might be set separately or is not mandatory here
                    return rodzajProduktuRepository.save(newRodzaj);
                });
            produkt.setRodzajProduktu(rodzajProduktu);
        }

        // Handle Jednostka
        if (StringUtils.hasText(dto.getJednostkaNazwa()) && StringUtils.hasText(dto.getJednostkaSkrot())) {
            Jednostka jednostka = jednostkaRepository.findByNazwaAndSkrot(dto.getJednostkaNazwa(), dto.getJednostkaSkrot())
                .orElseGet(() -> {
                    Jednostka newJednostka = new Jednostka();
                    newJednostka.setNazwa(dto.getJednostkaNazwa());
                    newJednostka.setSkrot(dto.getJednostkaSkrot());
                    return jednostkaRepository.save(newJednostka);
                });
            produkt.setJednostka(jednostka);
        }

        // Handle NadKategoria
        if (StringUtils.hasText(dto.getNadKategoriaNazwa())) {
            NadKategoria nadKategoria = nadKategoriaRepository.findByNazwa(dto.getNadKategoriaNazwa())
                .orElseGet(() -> {
                    NadKategoria newNadKategoria = new NadKategoria();
                    newNadKategoria.setNazwa(dto.getNadKategoriaNazwa());
                    newNadKategoria.setOpis(dto.getNadKategoriaOpis());
                    newNadKategoria.setKolejnosc(dto.getNadKategoriaKolejnosc());
                    return nadKategoriaRepository.save(newNadKategoria);
                });
            produkt.setNadKategoria(nadKategoria);
            // If RodzajProduktu was created and needs linking to this NadKategoria
            if (produkt.getRodzajProduktu() != null && produkt.getRodzajProduktu().getNadKategoria() == null && produkt.getRodzajProduktu().getId() != null) {
                RodzajProduktu rpToUpdate = produkt.getRodzajProduktu();
                rpToUpdate.setNadKategoria(nadKategoria);
                rodzajProduktuRepository.save(rpToUpdate);
            }
        }

        // Handle Opakowanie
        if (StringUtils.hasText(dto.getOpakowanieNazwa())) {
            Opakowanie opakowanie = opakowanieRepository.findByNazwa(dto.getOpakowanieNazwa())
                .orElseGet(() -> {
                    Opakowanie newOpakowanie = new Opakowanie();
                    newOpakowanie.setNazwa(dto.getOpakowanieNazwa());
                    newOpakowanie.setSkrot(dto.getOpakowanieSkrot());
                    newOpakowanie.setOpis(dto.getOpakowanieOpis());
                    return opakowanieRepository.save(newOpakowanie);
                });
            produkt.setOpakowanie(opakowanie);
        }

        // Handle StawkaVat
        if (dto.getStawkaVatWartosc() != null) {
            StawkaVat stawkaVat = stawkaVatRepository.findByWartosc(dto.getStawkaVatWartosc())
                .orElseGet(() -> {
                    StawkaVat newStawkaVat = new StawkaVat();
                    newStawkaVat.setWartosc(dto.getStawkaVatWartosc());
                    return stawkaVatRepository.save(newStawkaVat);
                });
            produkt.setStawkaVat(stawkaVat);
        }

        // Handle KodTowaru, KodEan, Identyfikator (find or create)
        if (StringUtils.hasText(dto.getKodTowaruKod())) {
            KodTowaru kt = kodTowaruRepository.findByKod(dto.getKodTowaruKod())
                .orElseGet(() -> {
                    KodTowaru newKt = new KodTowaru();
                    newKt.setKod(dto.getKodTowaruKod());
                    return kodTowaruRepository.save(newKt);
                });
            produkt.setKodTowaru(kt);
        }
        if (StringUtils.hasText(dto.getKodEanKod())) {
            KodEan ke = kodEanRepository.findByKod(dto.getKodEanKod())
                .orElseGet(() -> {
                    KodEan newKe = new KodEan();
                    newKe.setKod(dto.getKodEanKod());
                    return kodEanRepository.save(newKe);
                });
            produkt.setKodEan(ke);
        }
        if (StringUtils.hasText(dto.getIdentyfikatorWartosc())) {
            Identyfikator idf = identyfikatorRepository.findByWartosc(dto.getIdentyfikatorWartosc())
                .orElseGet(() -> {
                    Identyfikator newIdf = new Identyfikator();
                    newIdf.setWartosc(dto.getIdentyfikatorWartosc());
                    return identyfikatorRepository.save(newIdf);
                });
            produkt.setIdentyfikator(idf);
        }

        // Save Produkt first to get its ID (without SkladnikiEntities and ZdjeciaEntities yet)
        // and to ensure related entities (like RodzajProduktu) have their IDs if newly created
        Produkt savedProdukt = produktRepository.save(produkt);

        // Handle Skladniki
        Set<Skladnik> managedSkladniki = new HashSet<>();
        List<Integer> skladnikiIds = new ArrayList<>();
        if (dto.getSkladniki() != null && !dto.getSkladniki().isEmpty()) {
            for (String nazwaSkladnika : dto.getSkladniki()) {
                if (StringUtils.hasText(nazwaSkladnika)) {
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
                if (zdjecieDto.getDaneZdjecia() != null && zdjecieDto.getDaneZdjecia().length > 0) {
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
        if (StringUtils.hasText(dto.getNazwa()) && !dto.getNazwa().equals(produkt.getNazwa())) {
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
        if(StringUtils.hasText(dto.getOpis())) produkt.setOpis(dto.getOpis());

        // Update RodzajProduktu
        if (StringUtils.hasText(dto.getRodzajProduktuNazwa())) {
            RodzajProduktu rodzajProduktu = rodzajProduktuRepository.findByNazwa(dto.getRodzajProduktuNazwa())
                .orElseGet(() -> {
                    RodzajProduktu newRodzaj = new RodzajProduktu();
                    newRodzaj.setNazwa(dto.getRodzajProduktuNazwa());
                    newRodzaj.setOpis(dto.getRodzajProduktuOpis());
                    return rodzajProduktuRepository.save(newRodzaj);
                });
            produkt.setRodzajProduktu(rodzajProduktu);
        } else {
            produkt.setRodzajProduktu(null); // Or handle as per business logic if it cannot be null
        }

        // Update Jednostka
        if (StringUtils.hasText(dto.getJednostkaNazwa()) && StringUtils.hasText(dto.getJednostkaSkrot())) {
            Jednostka jednostka = jednostkaRepository.findByNazwaAndSkrot(dto.getJednostkaNazwa(), dto.getJednostkaSkrot())
                .orElseGet(() -> {
                    Jednostka newJednostka = new Jednostka();
                    newJednostka.setNazwa(dto.getJednostkaNazwa());
                    newJednostka.setSkrot(dto.getJednostkaSkrot());
                    return jednostkaRepository.save(newJednostka);
                });
            produkt.setJednostka(jednostka);
        } else {
            produkt.setJednostka(null);
        }

        // Update NadKategoria
        if (StringUtils.hasText(dto.getNadKategoriaNazwa())) {
            NadKategoria nadKategoria = nadKategoriaRepository.findByNazwa(dto.getNadKategoriaNazwa())
                .orElseGet(() -> {
                    NadKategoria newNadKategoria = new NadKategoria();
                    newNadKategoria.setNazwa(dto.getNadKategoriaNazwa());
                    newNadKategoria.setOpis(dto.getNadKategoriaOpis());
                    newNadKategoria.setKolejnosc(dto.getNadKategoriaKolejnosc());
                    return nadKategoriaRepository.save(newNadKategoria);
                });
            produkt.setNadKategoria(nadKategoria);
            // If RodzajProduktu was updated/created and needs linking
            if (produkt.getRodzajProduktu() != null && produkt.getRodzajProduktu().getNadKategoria() == null && produkt.getRodzajProduktu().getId() != null) {
                 RodzajProduktu rpToUpdate = produkt.getRodzajProduktu();
                 if(!nadKategoria.equals(rpToUpdate.getNadKategoria())){
                    rpToUpdate.setNadKategoria(nadKategoria);
                    rodzajProduktuRepository.save(rpToUpdate);
                 }
            }
        } else {
            produkt.setNadKategoria(null);
        }

        // Update Opakowanie
        if (StringUtils.hasText(dto.getOpakowanieNazwa())) {
            Opakowanie opakowanie = opakowanieRepository.findByNazwa(dto.getOpakowanieNazwa())
                .orElseGet(() -> {
                    Opakowanie newOpakowanie = new Opakowanie();
                    newOpakowanie.setNazwa(dto.getOpakowanieNazwa());
                    newOpakowanie.setSkrot(dto.getOpakowanieSkrot());
                    newOpakowanie.setOpis(dto.getOpakowanieOpis());
                    return opakowanieRepository.save(newOpakowanie);
                });
            produkt.setOpakowanie(opakowanie);
        } else {
            produkt.setOpakowanie(null);
        }

        // Update StawkaVat
        if (dto.getStawkaVatWartosc() != null) {
            StawkaVat stawkaVat = stawkaVatRepository.findByWartosc(dto.getStawkaVatWartosc())
                .orElseGet(() -> {
                    StawkaVat newStawkaVat = new StawkaVat();
                    newStawkaVat.setWartosc(dto.getStawkaVatWartosc());
                    return stawkaVatRepository.save(newStawkaVat);
                });
            produkt.setStawkaVat(stawkaVat);
        } else {
            produkt.setStawkaVat(null);
        }

        // Update KodTowaru, KodEan, Identyfikator
        if (StringUtils.hasText(dto.getKodTowaruKod())) {
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
        if (StringUtils.hasText(dto.getKodEanKod())) {
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
        if (StringUtils.hasText(dto.getIdentyfikatorWartosc())) {
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

        // First save to update basic fields and simple relations
        Produkt updatedProdukt = produktRepository.save(produkt);

        // Handle Skladniki update
        Set<Skladnik> managedSkladniki = new HashSet<>();
        List<Integer> skladnikiIds = new ArrayList<>();
        if (dto.getSkladniki() != null) { // Allow empty list to clear skladniki
            for (String nazwaSkladnika : dto.getSkladniki()) {
                 if (StringUtils.hasText(nazwaSkladnika)) {
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
        }
        updatedProdukt.setSkladnikiEntities(managedSkladniki);
        try {
            updatedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Skladnik IDs to JSON for update", e);
        }

        // Handle Zdjecia update
        // This part needs careful handling: deleting old ones not in new list, adding new ones.
        List<Integer> zdjeciaIds = new ArrayList<>();
        List<Zdjecie> finalZdjeciaEntities = new ArrayList<>();

        if (dto.getZdjecia() != null) {
            List<Integer> newImageIdsFromDto = new ArrayList<>();
            // Add or update images from DTO
            for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                if (zdjecieDto.getDaneZdjecia() != null && zdjecieDto.getDaneZdjecia().length > 0) {
                    // For simplicity in this refactor, we assume all DTO images are new or replace existing.
                    // A more sophisticated update would involve matching by some ID if images could be updated.
                    // Here, we'll clear existing and add all from DTO as new.
                    // This means existing Zdjecie entities linked to this Produkt might need to be removed first if not present in DTO.

                    // For now, let's assume a simpler approach: remove all old, add all new.
                    // This is handled below by clearing and re-adding.
                }
            }
        }

        // Clear existing images and add new ones from DTO
        // This is a destructive update for images: all old are removed, all from DTO are added.
        if (updatedProdukt.getZdjeciaEntities() != null) {
            // zdjecieRepository.deleteAll(updatedProdukt.getZdjeciaEntities()); // This might be too aggressive if not careful with transactions
            // A safer way is to remove them from the product's collection and let orphanRemoval handle it, or delete by produkt_id
            List<Zdjecie> oldZdjecia = new ArrayList<>(updatedProdukt.getZdjeciaEntities());
            updatedProdukt.getZdjeciaEntities().clear(); // Clear from collection
            produktRepository.save(updatedProdukt); // Persist the clearing from collection
            zdjecieRepository.deleteAll(oldZdjecia); // Delete the orphaned entities
        }
        
        if (dto.getZdjecia() != null && !dto.getZdjecia().isEmpty()) {
            for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                if (zdjecieDto.getDaneZdjecia() != null && zdjecieDto.getDaneZdjecia().length > 0) {
                    Zdjecie zdjecie = new Zdjecie();
                    zdjecie.setDaneZdjecia(zdjecieDto.getDaneZdjecia());
                    zdjecie.setOpis(zdjecieDto.getOpis());
                    zdjecie.setKolejnosc(zdjecieDto.getKolejnosc());
                    zdjecie.setProdukt(updatedProdukt);
                    Zdjecie savedZdjecie = zdjecieRepository.save(zdjecie);
                    finalZdjeciaEntities.add(savedZdjecie);
                    zdjeciaIds.add(savedZdjecie.getId());
                }
            }
        }
        updatedProdukt.setZdjeciaEntities(finalZdjeciaEntities);

        try {
            updatedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(zdjeciaIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Zdjecie IDs to JSON for update", e);
        }

        return produktRepository.save(updatedProdukt);
    }


    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

        // Explicitly delete related Zdjecia if CascadeType.REMOVE or orphanRemoval=true is not enough
        // or if they need to be handled before the product is deleted.
        // If Zdjecie has @ManyToOne with Produkt and Produkt has @OneToMany with CascadeType.ALL/REMOVE, this might be redundant.
        // However, if zdjeciaJson is the primary store, this logic might differ.
        // For now, assuming JPA handles cascading deletes for ZdjeciaEntities based on @OneToMany mapping.

        // If there are other relations that need manual cleanup before deleting Produkt, add them here.
        // e.g., if Produkt_Skladnik join table entries are not cascaded properly.

        produktRepository.delete(produkt);
    }
}

