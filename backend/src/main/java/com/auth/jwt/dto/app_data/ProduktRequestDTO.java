package com.auth.jwt.dto.app_data;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProduktRequestDTO {

    // Produkt fields
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

    // Fields from RodzajProduktu
    private String rodzajProduktuNazwa; // Required, from RodzajProduktu.nazwa
    private String rodzajProduktuOpis;

    // Fields from Jednostka
    private String jednostkaNazwa; // Required, from Jednostka.nazwa
    private String jednostkaSkrot; // Required, from Jednostka.skrot

    // Fields from NadKategoria
    private String nadKategoriaNazwa; // Required, from NadKategoria.nazwa
    private String nadKategoriaOpis;
    private Integer nadKategoriaKolejnosc;

    // Fields from Opakowanie
    private String opakowanieNazwa; // Required, from Opakowanie.nazwa
    private String opakowanieSkrot;
    private String opakowanieOpis;

    // Fields from StawkaVat
    private BigDecimal stawkaVatWartosc; // Required, from StawkaVat.wartosc

    // Values for KodTowaru, KodEan, Identyfikator (to be found or created)
    private String kodTowaruKod; // Value of KodTowaru.kod
    private String kodEanKod;    // Value of KodEan.kod
    private String identyfikatorWartosc; // Value of Identyfikator.wartosc

    // List of ingredient names
    private List<String> skladniki; // List of Skladnik names

    // List of photo data
    private List<ZdjecieRequestDTO> zdjecia; // List of ZdjecieRequestDTO (byte[], opis, kolejnosc)
}

