package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Entity
@Table(name = "skladnik", schema = "app_data")
@Data
public class Skladnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skladnik_id")
    private Integer id;

    @Column(name = "nazwa", nullable = false, length = 100)
    private String nazwa;

    // Relacja ManyToMany z Produkt (właściciel relacji jest w Produkt)
    @ManyToMany(mappedBy = "skladniki")
    private Set<Produkt> produkty;
}

