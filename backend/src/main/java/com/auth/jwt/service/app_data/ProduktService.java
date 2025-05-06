package com.auth.jwt.service.app_data;

import com.auth.jwt.data.entity.app_data.*;
import com.auth.jwt.data.repository.app_data.*;
import com.auth.jwt.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

        if (produkt.getKodTowaru() != null && produkt.getKodTowaru().getKod() != null) {
            Optional<KodTowaru> existingKt = kodTowaruRepository.findByKod(produkt.getKodTowaru().getKod());
            if (existingKt.isPresent()) produkt.setKodTowaru(existingKt.get());
        }
        if (produkt.getKodEan() != null && produkt.getKodEan().getKod() != null) {
            Optional<KodEan> existingKe = kodEanRepository.findByKod(produkt.getKodEan().getKod());
            if (existingKe.isPresent()) produkt.setKodEan(existingKe.get());
        }
        if (produkt.getIdentyfikator() != null && produkt.getIdentyfikator().getWartosc() != null) {
            Optional<Identyfikator> existingId = identyfikatorRepository.findByWartosc(produkt.getIdentyfikator().getWartosc());
            if (existingId.isPresent()) produkt.setIdentyfikator(existingId.get());
        }

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
                        managedSkladniki.add(skladnikService.createSkladnik(new Skladnik(skladnik.getNazwa())));
                    }
                }
            }
            produkt.setSkladniki(managedSkladniki);
        }
        
        Produkt savedProdukt = produktRepository.save(produkt);

        if (produkt.getZdjecia() != null && !produkt.getZdjecia().isEmpty()) {
            List<Zdjecie> managedZdjecia = produkt.getZdjecia().stream().map(zdjecie -> {
                zdjecie.setProdukt(savedProdukt);
                return zdjecieRepository.save(zdjecie);
            }).collect(Collectors.toList());
            savedProdukt.setZdjecia(managedZdjecia);
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
        if (produktDetails.getSuperProdukt() != null) produkt.setSuperProdukt(produktDetails.getSuperProdukt());
        if (produktDetails.getTowarPolecany() != null) produkt.setTowarPolecany(produktDetails.getTowarPolecany());
        if (produktDetails.getOpis() != null) produkt.setOpis(produktDetails.getOpis());

        if (produktDetails.getRodzajProduktu() != null && produktDetails.getRodzajProduktu().getId() != null) {
            produkt.setRodzajProduktu(rodzajProduktuRepository.findById(produktDetails.getRodzajProduktu().getId())
                .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu not found")));
        }

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

        if (produktDetails.getZdjecia() != null) {
            zdjecieRepository.deleteByProduktIdAndIdNotIn(produkt.getId(), 
                produktDetails.getZdjecia().stream().map(Zdjecie::getId).filter(imgId -> imgId != null).collect(Collectors.toList()));

            List<Zdjecie> updatedZdjecia = produktDetails.getZdjecia().stream().map(zdjecieDetail -> {
                zdjecieDetail.setProdukt(produkt);
                return zdjecieRepository.save(zdjecieDetail);
            }).collect(Collectors.toList());
            produkt.setZdjecia(updatedZdjecia);
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

