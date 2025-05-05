package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "zdjecie", schema = "app_data")
@Data
public class Zdjecie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zdjecie_id")
    private Integer id;

    @Column(name = "url", nullable = false, length = 500)
    private String url;

    @Column(name = "opis", length = 255)
    private String opis;

    @Column(name = "kolejnosc", columnDefinition = "INT DEFAULT 0")
    private Integer kolejnosc;

    // Relacja ManyToOne z Produkt
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produkt_id", nullable = false)
    private Produkt produkt;
}

