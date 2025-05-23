package com.auth.jwt.data.entity.app_data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "nad_kategoria", schema = "app_data")
@Data
public class NadKategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nad_kategoria_id")
    private Integer id;

    @Column(name = "nazwa", nullable = false, length = 100)
    private String nazwa;

    @Column(name = "opis", columnDefinition = "TEXT")
    private String opis;

    @Column(name = "kolejnosc", columnDefinition = "INT DEFAULT 0")
    private Integer kolejnosc;

    // Relacja OneToMany z RodzajProduktu
    @OneToMany(mappedBy = "nadKategoria", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference("nadkategoria-rodzajeproduktu")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore // Added JsonIgnore
    private List<RodzajProduktu> rodzajeProduktow;

    // Relacja OneToMany z Produkt (jeśli produkt może należeć bezpośrednio do nadkategorii)
    @OneToMany(mappedBy = "nadKategoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("nadkategoria-produkt") // Assuming a corresponding @JsonBackReference in Produkt
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore // Added JsonIgnore
    private List<Produkt> produkty;
}

