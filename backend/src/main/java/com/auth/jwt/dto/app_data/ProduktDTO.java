package com.auth.jwt.dto.app_data;

import com.auth.jwt.data.entity.app_data.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class ProduktDTO {

    private Integer id;
    private String nazwa;
    private BigDecimal waga;
    private BigDecimal cena;
    private Boolean superProdukt;
    private Boolean towarPolecany;
    private Boolean rekomendacjaSprzedawcy;
    private Boolean superCena;
    private Boolean nowosc;
    private Boolean superjakosc;
    private Boolean rabat;
    private Boolean dostepny;
    private Boolean dostepneOdReki;
    private Boolean dostepneDo7Dni;
    private Boolean dostepneNaZamowienie;
    private Boolean wartoKupic;
    private Boolean bezglutenowy;
    private String opis;
    private Integer wyswietlenia;
    private LocalDateTime dataDodania;
    private LocalDateTime dataAktualizacji;

    // Representing relationships with simpler structures or IDs
    private Integer rodzajProduktuId;
    private String rodzajProduktuNazwa;
    private Integer jednostkaId;
    private String jednostkaNazwa;
    private Integer nadKategoriaId;
    private String nadKategoriaNazwa;
    private Integer opakowanieId;
    private String opakowanieNazwa;
    private Integer stawkaVatId;
    private BigDecimal stawkaVatWartosc;
    private Integer kodTowaruId;
    private String kodTowaruKod;
    private Integer kodEanId;
    private String kodEanKod;
    private Integer identyfikatorId;
    private String identyfikatorWartosc;

    private List<Integer> skladnikiIds;
    private List<Integer> zdjeciaIds;

    public ProduktDTO(Produkt produkt) {
        this.id = produkt.getId();
        this.nazwa = produkt.getNazwa();
        this.waga = produkt.getWaga();
        this.cena = produkt.getCena();
        this.superProdukt = produkt.getSuperProdukt();
        this.towarPolecany = produkt.getTowarPolecany();
        this.rekomendacjaSprzedawcy = produkt.getRekomendacjaSprzedawcy();
        this.superCena = produkt.getSuperCena();
        this.nowosc = produkt.getNowosc();
        this.superjakosc = produkt.getSuperjakosc();
        this.rabat = produkt.getRabat();
        this.dostepny = produkt.getDostepny();
        this.dostepneOdReki = produkt.getDostepneOdReki();
        this.dostepneDo7Dni = produkt.getDostepneDo7Dni();
        this.dostepneNaZamowienie = produkt.getDostepneNaZamowienie();
        this.wartoKupic = produkt.getWartoKupic();
        this.bezglutenowy = produkt.getBezglutenowy();
        this.opis = produkt.getOpis();
        this.wyswietlenia = produkt.getWyswietlenia();
        this.dataDodania = produkt.getDataDodania();
        this.dataAktualizacji = produkt.getDataAktualizacji();

        if (produkt.getRodzajProduktu() != null) {
            this.rodzajProduktuId = produkt.getRodzajProduktu().getId();
            this.rodzajProduktuNazwa = produkt.getRodzajProduktu().getNazwa();
        }
        if (produkt.getJednostka() != null) {
            this.jednostkaId = produkt.getJednostka().getId();
            this.jednostkaNazwa = produkt.getJednostka().getNazwa();
        }
        if (produkt.getNadKategoria() != null) {
            this.nadKategoriaId = produkt.getNadKategoria().getId();
            this.nadKategoriaNazwa = produkt.getNadKategoria().getNazwa();
        }
        if (produkt.getOpakowanie() != null) {
            this.opakowanieId = produkt.getOpakowanie().getId();
            this.opakowanieNazwa = produkt.getOpakowanie().getNazwa();
        }
        if (produkt.getStawkaVat() != null) {
            this.stawkaVatId = produkt.getStawkaVat().getId();
            this.stawkaVatWartosc = produkt.getStawkaVat().getWartosc();
        }
        if (produkt.getKodTowaru() != null) {
            this.kodTowaruId = produkt.getKodTowaru().getId();
            this.kodTowaruKod = produkt.getKodTowaru().getKod();
        }
        if (produkt.getKodEan() != null) {
            this.kodEanId = produkt.getKodEan().getId();
            this.kodEanKod = produkt.getKodEan().getKod();
        }
        if (produkt.getIdentyfikator() != null) {
            this.identyfikatorId = produkt.getIdentyfikator().getId();
            this.identyfikatorWartosc = produkt.getIdentyfikator().getWartosc();
        }

        if (produkt.getSkladniki() != null) {
            this.skladnikiIds = produkt.getSkladniki().stream()
                                     .map(Skladnik::getId)
                                     .collect(Collectors.toList());
        }
        if (produkt.getZdjecia() != null) {
            this.zdjeciaIds = produkt.getZdjecia().stream()
                                   .map(Zdjecie::getId)
                                   .collect(Collectors.toList());
        }
    }
}

