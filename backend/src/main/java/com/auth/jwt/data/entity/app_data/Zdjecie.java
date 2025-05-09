package com.auth.jwt.data.entity.app_data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "zdjecie", schema = "app_data")
@Data
public class Zdjecie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zdjecie_id")
    private Integer id;

    @Column(name = "nazwa", length = 255) // Added field
    private String nazwa;

    @Lob
    @Column(name = "base64", columnDefinition="TEXT") // Added field, assuming TEXT for potentially long base64 strings
    private String base64;

    @Lob
    @Column(name = "dane_zdjecia", nullable = true, columnDefinition="LONGBLOB") // Made nullable as base64 might be used instead
    private byte[] daneZdjecia;

    @Column(name = "opis", length = 255)
    private String opis;

    @Column(name = "kolejnosc", columnDefinition = "INT DEFAULT 0")
    private Integer kolejnosc;

    // Relacja ManyToOne z Produkt
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produkt_id", nullable = false)
    @JsonBackReference("produkt-zdjecie")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Produkt produkt;
}

