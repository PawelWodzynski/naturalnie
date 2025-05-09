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

    public ProduktAndZdjeciaPaginatedDto getAllProduktyPaginated(Pageable pageable, Integer nadKategoriaId, Integer rodzajProduktuId, String searchTerm) {
        try {
            Page<Produkt> pageResult;
            boolean hasSearchTerm = StringUtils.hasText(searchTerm);

            NadKategoria nadKategoria = null;
            if (nadKategoriaId != null && nadKategoriaId != 0) {
                Optional<NadKategoria> nadKategoriaOpt = nadKategoriaRepository.findById(nadKategoriaId);
                if (!nadKategoriaOpt.isPresent()) {
                    log.warn("NadKategoria with ID {} not found. Returning empty list.", nadKategoriaId);
                    return new ProduktAndZdjeciaPaginatedDto(new ArrayList<>(), 0);
                }
                nadKategoria = nadKategoriaOpt.get();
            }

            RodzajProduktu rodzajProduktu = null;
            if (rodzajProduktuId != null && rodzajProduktuId != 0) { // Assuming 0 means "all" or "not specified" for filtering
                Optional<RodzajProduktu> rodzajProduktuOpt = rodzajProduktuRepository.findById(rodzajProduktuId);
                if (!rodzajProduktuOpt.isPresent()) {
                    log.warn("RodzajProduktu with ID {} not found. Returning empty list.", rodzajProduktuId);
                    return new ProduktAndZdjeciaPaginatedDto(new ArrayList<>(), 0);
                }
                rodzajProduktu = rodzajProduktuOpt.get();
            }

            if (hasSearchTerm) {
                if (nadKategoria != null && rodzajProduktu != null) {
                    pageResult = produktRepository.findByNazwaContainingIgnoreCaseAndNadKategoriaAndRodzajProduktu(searchTerm, nadKategoria, rodzajProduktu, pageable);
                } else if (nadKategoria != null) {
                    pageResult = produktRepository.findByNazwaContainingIgnoreCaseAndNadKategoria(searchTerm, nadKategoria, pageable);
                } else if (rodzajProduktu != null) {
                    pageResult = produktRepository.findByNazwaContainingIgnoreCaseAndRodzajProduktu(searchTerm, rodzajProduktu, pageable);
                } else { // Only searchTerm
                    pageResult = produktRepository.findByNazwaContainingIgnoreCase(searchTerm, pageable);
                }
            } else { // No searchTerm, use logic based on nadKategoria and rodzajProduktu
                if (nadKategoria != null && rodzajProduktu != null) {
                    pageResult = produktRepository.findByNadKategoriaAndRodzajProduktu(nadKategoria, rodzajProduktu, pageable);
                } else if (nadKategoria != null) {
                    pageResult = produktRepository.findByNadKategoria(nadKategoria, pageable);
                } else if (rodzajProduktu != null) {
                    pageResult = produktRepository.findByRodzajProduktu(rodzajProduktu, pageable);
                } else { // No filters at all
                    pageResult = produktRepository.findAll(pageable);
                }
            }

            List<Produkt> produkty = pageResult.getContent();
            List<ProduktAndZdjeciaDto> produktAndZdjeciaDtos = new ArrayList<>();

            for (Produkt produkt : produkty) {
                ProduktDTO produktDto = new ProduktDTO(produkt);
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

        Produkt savedProdukt = produktRepository.save(produkt);

        Set<Skladnik> managedSkladniki = new HashSet<>();
        List<Integer> skladnikiIds = new ArrayList<>();
        if (dto.getSkladniki() != null && !dto.getSkladniki().isEmpty()) {
            for (String skladnikNazwa : dto.getSkladniki()) {
                Skladnik skladnik = skladnikRepository.findByNazwa(skladnikNazwa)
                    .orElseGet(() -> {
                        Skladnik newSkladnik = new Skladnik();
                        newSkladnik.setNazwa(skladnikNazwa);
                        return skladnikRepository.save(newSkladnik);
                    });
                managedSkladniki.add(skladnik);
                skladnikiIds.add(skladnik.getId());
            }
        }
        try {
            savedProdukt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
        } catch (JsonProcessingException e) {
            log.error("Błąd serializacji ID składników do JSON dla produktu: " + savedProdukt.getNazwa(), e);
        }

        List<Integer> zdjeciaIds = new ArrayList<>();
        if (dto.getZdjecia() != null && !dto.getZdjecia().isEmpty()) {
            for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                Zdjecie zdjecie = new Zdjecie();
                zdjecie.setNazwa(zdjecieDto.getNazwa());
                zdjecie.setBase64(zdjecieDto.getBase64());
                zdjecie.setProdukt(savedProdukt); // Associate with the saved product
                Zdjecie savedZdjecie = zdjecieRepository.save(zdjecie);
                zdjeciaIds.add(savedZdjecie.getId());
            }
        }
        try {
            savedProdukt.setZdjeciaJson(objectMapper.writeValueAsString(zdjeciaIds));
        } catch (JsonProcessingException e) {
            log.error("Błąd serializacji ID zdjęć do JSON dla produktu: " + savedProdukt.getNazwa(), e);
        }

        return produktRepository.save(savedProdukt); // Save again to update JSON fields
    }

    @Transactional("appDataTransactionManager")
    public Produkt updateProdukt(Integer id, ProduktRequestDTO dto) {
        Produkt produkt = produktRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));

        // Update direct fields
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

        // Update Skladniki
        Set<Skladnik> managedSkladniki = new HashSet<>();
        List<Integer> skladnikiIds = new ArrayList<>();
        if (dto.getSkladniki() != null && !dto.getSkladniki().isEmpty()) {
            for (String skladnikNazwa : dto.getSkladniki()) {
                Skladnik skladnik = skladnikRepository.findByNazwa(skladnikNazwa)
                    .orElseGet(() -> {
                        Skladnik newSkladnik = new Skladnik();
                        newSkladnik.setNazwa(skladnikNazwa);
                        return skladnikRepository.save(newSkladnik);
                    });
                managedSkladniki.add(skladnik);
                skladnikiIds.add(skladnik.getId());
            }
        }
        try {
            produkt.setSkladnikiJson(objectMapper.writeValueAsString(skladnikiIds));
        } catch (JsonProcessingException e) {
            log.error("Błąd serializacji ID składników do JSON dla produktu: " + produkt.getNazwa(), e);
        }

        // Update Zdjecia - this part might need more complex logic for adding/removing/updating existing photos
        // For simplicity, this example clears existing and adds new ones. Consider a more nuanced approach.
        zdjecieRepository.deleteByProdukt(produkt); // Clear existing photos for this product
        List<Integer> zdjeciaIds = new ArrayList<>();
        if (dto.getZdjecia() != null && !dto.getZdjecia().isEmpty()) {
            for (ZdjecieRequestDTO zdjecieDto : dto.getZdjecia()) {
                Zdjecie zdjecie = new Zdjecie();
                zdjecie.setNazwa(zdjecieDto.getNazwa());
                zdjecie.setBase64(zdjecieDto.getBase64());
                zdjecie.setProdukt(produkt);
                Zdjecie savedZdjecie = zdjecieRepository.save(zdjecie);
                zdjeciaIds.add(savedZdjecie.getId());
            }
        }
        try {
            produkt.setZdjeciaJson(objectMapper.writeValueAsString(zdjeciaIds));
        } catch (JsonProcessingException e) {
            log.error("Błąd serializacji ID zdjęć do JSON dla produktu: " + produkt.getNazwa(), e);
        }

        return produktRepository.save(produkt);
    }

    @Transactional("appDataTransactionManager")
    public void deleteProdukt(Integer id) {
        Produkt produkt = produktRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
        // Also delete associated Zdjecia
        zdjecieRepository.deleteByProdukt(produkt);
        produktRepository.delete(produkt);
    }
}

