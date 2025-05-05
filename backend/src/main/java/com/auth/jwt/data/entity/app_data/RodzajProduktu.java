package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "rodzaj_produktu", schema = "app_data")
@Data
public class RodzajProduktu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rodzaj_produktu_id")
    private Integer id;

    @Column(name = "nazwa", nullable = false, length = 100)
    private String nazwa;

    @Column(name = "opis", columnDefinition = "TEXT")
    private String opis;

    // Relacja ManyToOne z NadKategoria
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nad_kategoria_id")
    private NadKategoria nadKategoria;

    // Relacja OneToMany z Produkt
    @OneToMany(mappedBy = "rodzajProduktu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Produkt> produkty;
}

