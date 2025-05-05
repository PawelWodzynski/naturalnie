package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "identyfikator", schema = "app_data")
@Data
public class Identyfikator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "identyfikator_id")
    private Integer id;

    @Column(name = "wartosc", nullable = false, unique = true, length = 30)
    private String wartosc;

    // Relacja OneToOne z Produkt (Produkt jest właścicielem)
    @OneToOne(mappedBy = "identyfikator", fetch = FetchType.LAZY)
    private Produkt produkt;
}

