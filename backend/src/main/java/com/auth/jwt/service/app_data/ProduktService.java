package com.auth.jwt.service.app_data;

import com.auth.jwt.data.dto.app_data.ProduktAndZdjeciaDto;
import com.auth.jwt.data.entity.app_data.*;
import com.auth.jwt.data.repository.app_data.*;
import com.auth.jwt.dto.app_data.ProduktRequestDTO;
import com.auth.jwt.dto.app_data.ZdjecieRequestDTO;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
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
import com.auth.jwt.dto.app_data.ProduktDTO;
import com.auth.jwt.dto.app_data.ZdjecieDTO;
import com.auth.jwt.dto.app_data.SkladnikDTO;
import com.auth.jwt.data.dto.app_data.ProduktAndZdjeciaPaginatedDto;

@Slf4j
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

    public ProduktAndZdjeciaPaginatedDto getAllProduktyPaginated(Pageable pageable, Integer nadKategoriaId, Integer rodzajProduktuId) {
        try {
            Page<Produkt> pageResult = Page.empty(pageable);

            if (rodzajProduktuId != null) {
                Optional<RodzajProduktu> rodzajProduktuOpt = rodzajProduktuRepository.findById(rodzajProduktuId);
                if (!rodzajProduktuOpt.isPresent()) {
                    log.warn("RodzajProduktu with ID {} not found. Returning empty list.", rodzajProduktuId);
                    return new ProduktAndZdjeciaPaginatedDto(new ArrayList<>(), 0);
                }
                RodzajProduktu rodzajProduktu = rodzajProduktuOpt.get();

                if (nadKategoriaId != null) {
                    Optional<NadKategoria> nadKategoriaOpt = nadKategoriaRepository.findById(nadKategoriaId);
                    if (!nadKategoriaOpt.isPresent()) {
                        log.warn("NadKategoria with ID {} not found (with RodzajProduktu ID {}). Returning empty list.", nadKategoriaId, rodzajProduktuId);
                        return new ProduktAndZdjeciaPaginatedDto(new ArrayList<>(), 0);
                    }
                    NadKategoria nadKategoria = nadKategoriaOpt.get();
                    pageResult = produktRepository.findByNadKategoriaAndRodzajProduktu(nadKategoria, rodzajProduktu, pageable);
                } else {
                    // Only rodzajProduktuId is present
                    pageResult = produktRepository.findByRodzajProduktu(rodzajProduktu, pageable);
                }
            } else {
                // rodzajProduktuId is null
                if (nadKategoriaId != null) {
                    Optional<NadKategoria> nadKategoriaOpt = nadKategoriaRepository.findById(nadKategoriaId);
                    if (!nadKategoriaOpt.isPresent()) {
                        log.warn("NadKategoria with ID {} not found. Returning empty list.", nadKategoriaId);
                        return new ProduktAndZdjeciaPaginatedDto(new ArrayList<>(), 0);
                    }
                    NadKategoria nadKategoria = nadKategoriaOpt.get();
                    pageResult = produktRepository.findByNadKategoria(nadKategoria, pageable);
                } else {
                    // Neither nadKategoriaId nor rodzajProduktuId is provided. Fetch all products paginated.
                    pageResult = produktRepository.findAll(pageable);
                }
            }

            List<Produkt> produkty = pageResult.getContent();
            List<ProduktAndZdjeciaDto> produktAndZdjeciaDtos = new ArrayList<>();

            for (Produkt produkt : produkty) {
                // 1. Initialize ProduktDTO (basic fields are set by its constructor)
                ProduktDTO produktDto = new ProduktDTO(produkt);

                // 2. Fetch and map Skladniki for ProduktDTO
                List<Skladnik> currentSkladnikiEntities = new ArrayList<>();
                if (produkt.getSkladnikiJson() != null && !produkt.getSkladnikiJson().isEmpty()) {
                    try {
                        Integer[] ids = this.objectMapper.readValue(produkt.getSkladnikiJson(), Integer[].class);
                        for (Integer id : ids) {
                            skladnikRepository.findById(id).ifPresent(currentSkladnikiEntities::add);
                        }
                    } catch (JsonProcessingException e) {
                        log.error("Błąd parsowania JSON dla składników produktu o ID: " + produkt.getId(), e);
                    }
                }
                List<SkladnikDTO> skladnikiDtoList = currentSkladnikiEntities.stream()
                        .map(SkladnikDTO::new)
                        .collect(Collectors.toList());
                produktDto.setSkladniki(skladnikiDtoList);

                // 3. Fetch and map Zdjecia for ProduktAndZdjeciaDto
                List<Zdjecie> currentZdjeciaEntitiesForZdjecia = new ArrayList<>();
                if (produkt.getZdjeciaJson() != null && !produkt.getZdjeciaJson().isEmpty()) {
                    try {
                        Integer[] ids = this.objectMapper.readValue(produkt.getZdjeciaJson(), Integer[].class);
                        for (Integer id : ids) {
                            zdjecieRepository.findById(id).ifPresent(currentZdjeciaEntitiesForZdjecia::add);
                        }
                    } catch (JsonProcessingException e) {
                        log.error("Błąd parsowania JSON dla zdjęć produktu o ID: " + produkt.getId(), e);
                    }
                }
                List<ZdjecieDTO> zdjeciaDtoListForOuter = currentZdjeciaEntitiesForZdjecia.stream()
                                                              .map(ZdjecieDTO::new)
                                                              .collect(Collectors.toList());

                // 4. Create and populate ProduktAndZdjeciaDto
                ProduktAndZdjeciaDto produktAndZdjeciaDto = new ProduktAndZdjeciaDto();
                produktAndZdjeciaDto.setProdukt(produktDto);
                produktAndZdjeciaDto.setZdjecia(zdjeciaDtoListForOuter);

                produktAndZdjeciaDtos.add(produktAndZdjeciaDto);
            }
            return new ProduktAndZdjeciaPaginatedDto(produktAndZdjeciaDtos, pageResult.getTotalPages());

        } catch (Exception e) {
            log.error("Błąd podczas pobierania paginowanej listy produktów: {}", e.getMessage(), e);
            return new ProduktAndZdjeciaPaginatedDto(new ArrayList<>(), 0);
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

        Produkt savedProdukt = produktRepository.save(produkt);

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
        savedProdukt.setSkladnikiEntities(managedSkladniki);
        try {
            savedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Skladnik IDs to JSON", e);
        }

        List<Zdjecie> managedZdjecia = new ArrayList<>();
        List<Integer> zdjeciaIds = new ArrayList<>();
        if (dto.getZdjecia() != null && !dto.getZdjecia().isEmpty()) {
            for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                if (zdjecieDto.getDaneZdjecia() != null && zdjecieDto.getDaneZdjecia().length > 0) { // Check if binary data is present
                    Zdjecie zdjecie = new Zdjecie();
                    zdjecie.setDaneZdjecia(zdjecieDto.getDaneZdjecia());
                    zdjecie.setOpis(zdjecieDto.getOpis());
                    zdjecie.setKolejnosc(zdjecieDto.getKolejnosc());
                    zdjecie.setProdukt(savedProdukt);
                    Zdjecie savedZdjecie = zdjecieRepository.save(zdjecie);
                    managedZdjecia.add(savedZdjecie);
                    zdjeciaIds.add(savedZdjecie.getId());
                }
            }
        }
        savedProdukt.setZdjeciaEntities(managedZdjecia);
        try {
            savedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(zdjeciaIds));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing Zdjecie IDs to JSON", e);
        }

        return produktRepository.save(savedProdukt);
    }

    @Transactional("appDataTransactionManager")
    public Produkt updateProdukt(Integer id, ProduktRequestDTO dto) {
        Produkt produkt = produktRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

        if (StringUtils.hasText(dto.getNazwa()) && !dto.getNazwa().equals(produkt.getNazwa())) {
            produktRepository.findByNazwa(dto.getNazwa()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Produkt o nazwie '" + dto.getNazwa() + "' ju	 istnieje.");
                }
            });
            produkt.setNazwa(dto.getNazwa());
        }

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

        if (StringUtils.hasText(dto.getRodzajProduktuNazwa())) {
            RodzajProduktu rodzajProduktu = rodzajProduktuRepository.findByNazwa(dto.getRodzajProduktuNazwa())
                .orElseGet(() -> {
                    RodzajProduktu newRodzaj = new RodzajProduktu();
                    newRodzaj.setNazwa(dto.getRodzajProduktuNazwa());
                    newRodzaj.setOpis(dto.getRodzajProduktuOpis());
                    if (produkt.getNadKategoria() != null) { // Link to existing NadKategoria if present
                        newRodzaj.setNadKategoria(produkt.getNadKategoria());
                    }
                    return rodzajProduktuRepository.save(newRodzaj);
                });
            produkt.setRodzajProduktu(rodzajProduktu);
        }

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
            if (produkt.getRodzajProduktu() != null && produkt.getRodzajProduktu().getNadKategoria() == null && produkt.getRodzajProduktu().getId() != null) {
                RodzajProduktu rpToUpdate = produkt.getRodzajProduktu();
                rpToUpdate.setNadKategoria(nadKategoria);
                rodzajProduktuRepository.save(rpToUpdate);
            }
        }

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

        if (dto.getStawkaVatWartosc() != null) {
            StawkaVat stawkaVat = stawkaVatRepository.findByWartosc(dto.getStawkaVatWartosc())
                .orElseGet(() -> {
                    StawkaVat newStawkaVat = new StawkaVat();
                    newStawkaVat.setWartosc(dto.getStawkaVatWartosc());
                    return stawkaVatRepository.save(newStawkaVat);
                });
            produkt.setStawkaVat(stawkaVat);
        }

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

        // Handle Skladniki update
        if (dto.getSkladniki() != null) { 
            Set<Skladnik> managedSkladniki = new HashSet<>();
            List<Integer> skladnikiIds = new ArrayList<>();
            if (!dto.getSkladniki().isEmpty()) {
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
            produkt.getSkladnikiEntities().clear();
            produkt.getSkladnikiEntities().addAll(managedSkladniki);
            try {
                produkt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error serializing Skladnik IDs to JSON for update", e);
            }
        }

        // Handle Zdjecia update
        if (dto.getZdjecia() != null) { 
            produkt.getZdjeciaEntities().clear(); 
            zdjecieRepository.deleteAllByProduktId(produkt.getId()); 

            List<Zdjecie> managedZdjecia = new ArrayList<>();
            List<Integer> zdjeciaIds = new ArrayList<>();
            if (!dto.getZdjecia().isEmpty()) {
                for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                    if (zdjecieDto.getDaneZdjecia() != null && zdjecieDto.getDaneZdjecia().length > 0) { // Check if binary data is present
                        Zdjecie zdjecie = new Zdjecie();
                        zdjecie.setDaneZdjecia(zdjecieDto.getDaneZdjecia());
                        zdjecie.setOpis(zdjecieDto.getOpis());
                        zdjecie.setKolejnosc(zdjecieDto.getKolejnosc());
                        zdjecie.setProdukt(produkt); 
                        Zdjecie savedZdjecie = zdjecieRepository.save(zdjecie); 
                        managedZdjecia.add(savedZdjecie);
                        zdjeciaIds.add(savedZdjecie.getId());
                    }
                }
            }
            produkt.setZdjeciaEntities(managedZdjecia);
            try {
                produkt.setZdjeciaJson(objectMapper.writeValueAsString(zdjeciaIds));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error serializing Zdjecie IDs to JSON for update", e);
            }
        }

        return produktRepository.save(produkt);
    }

    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        if (!produktRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony.");
        }
        produktRepository.deleteById(id);
    }
}

