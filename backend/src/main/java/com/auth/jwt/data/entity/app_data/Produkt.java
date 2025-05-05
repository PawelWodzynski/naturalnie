package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "produkt", schema = "app_data")
@Data
public class Produkt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "produkt_id")
    private Integer id;

    @Column(name = "nazwa", nullable = false, length = 255)
    private String nazwa;

    @Column(name = "waga", precision = 10, scale = 2)
    private BigDecimal waga;

    @Column(name = "cena", nullable = false, precision = 10, scale = 2)
    private BigDecimal cena;

    // Promotional flags
    @Column(name = "super_produkt", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean superProdukt = false;

    @Column(name = "towar_polecany", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean towarPolecany = false;

    @Column(name = "rekomendacja_sprzedawcy", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean rekomendacjaSprzedawcy = false;

    @Column(name = "super_cena", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean superCena = false;

    @Column(name = "nowosc", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean nowosc = false;

    @Column(name = "superjakosc", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean superjakosc = false;

    @Column(name = "rabat", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean rabat = false;

    // Availability flags
    @Column(name = "dostepny", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean dostepny = true;

    @Column(name = "dostepne_od_reki", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean dostepneOdReki = false;

    @Column(name = "dostepne_do_7_dni", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean dostepneDo7Dni = false;

    @Column(name = "dostepne_na_zamowienie", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean dostepneNaZamowienie = false;

    @Column(name = "warto_kupic", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean wartoKupic = false;

    // Gluten-free flag
    @Column(name = "bezglutenowy", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean bezglutenowy = false;

    // Description
    @Column(name = "opis", columnDefinition = "TEXT")
    private String opis;

    // View counter
    @Column(name = "wyswietlenia", columnDefinition = "INT DEFAULT 0")
    private Integer wyswietlenia = 0;

    // Timestamps
    @CreationTimestamp
    @Column(name = "data_dodania", updatable = false)
    private LocalDateTime dataDodania;

    @UpdateTimestamp
    @Column(name = "data_aktualizacji")
    private LocalDateTime dataAktualizacji;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rodzaj_produktu_id")
    private RodzajProduktu rodzajProduktu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jednostka_id")
    private Jednostka jednostka;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nad_kategoria_id")
    private NadKategoria nadKategoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opakowanie_id")
    private Opakowanie opakowanie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stawka_vat_id")
    private StawkaVat stawkaVat;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "kod_towaru_id", referencedColumnName = "kod_towaru_id")
    private KodTowaru kodTowaru;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "kod_ean_id", referencedColumnName = "kod_ean_id")
    private KodEan kodEan;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "identyfikator_id", referencedColumnName = "identyfikator_id")
    private Identyfikator identyfikator;

    // ManyToMany relationship with Skladnik
    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "produkt_skladnik", // Name of the join table
        schema = "app_data",
        joinColumns = @JoinColumn(name = "produkt_id"),
        inverseJoinColumns = @JoinColumn(name = "skladnik_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Skladnik> skladniki = new HashSet<>();

    // OneToMany relationship with Zdjecie
    @OneToMany(mappedBy = "produkt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Zdjecie> zdjecia;

    // Note: The 'zdjecia' TEXT column from SQL is omitted as the Zdjecie entity handles images.
    // Note: The 'skladniki' TEXT column from SQL is replaced by the ManyToMany relationship.
}

