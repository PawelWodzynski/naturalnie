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

    @Lob
    @Column(name = "dane_zdjecia", nullable = true, columnDefinition="LONGBLOB") // Assuming URL might be primary, so data can be nullable if URL is present
    private byte[] daneZdjecia;

    @Column(name = "url", nullable = false, length = 1024) // Added URL field, assuming it's a required field
    private String url;

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

