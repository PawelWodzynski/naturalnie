package com.auth.jwt.dto.app_data;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProduktRequestDTO {

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

    // IDs for simple relations
    private Integer rodzajProduktuId;
    private Integer jednostkaId;
    private Integer nadKategoriaId;
    private Integer opakowanieId;
    private Integer stawkaVatId;

    // Values for KodTowaru, KodEan, Identyfikator (to be found or created)
    private String kodTowaruKod; // Value of KodTowaru.kod
    private String kodEanKod;    // Value of KodEan.kod
    private String identyfikatorWartosc; // Value of Identyfikator.wartosc

    // List of ingredient names
    private List<String> skladniki; // List of Skladnik names

    // List of photo data
    private List<ZdjecieRequestDTO> zdjecia; // List of ZdjecieRequestDTO (byte[], opis, kolejnosc)
}

