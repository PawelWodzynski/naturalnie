package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "kod_ean", schema = "app_data")
@Data
public class KodEan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kod_ean_id")
    private Integer id;

    @Column(name = "kod", nullable = false, unique = true, length = 30)
    private String kod;

    // Relacja OneToOne z Produkt (Produkt jest właścicielem)
    @OneToOne(mappedBy = "kodEan", fetch = FetchType.LAZY)
    private Produkt produkt;
}

