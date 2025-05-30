package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor; // Added for JPA

import java.util.Set;

@Entity
@Table(name = "skladnik", schema = "app_data")
@Data
@NoArgsConstructor // Added for JPA
public class Skladnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skladnik_id")
    private Integer id;

    @Column(name = "nazwa", nullable = false, length = 100)
    private String nazwa;

    // Relacja ManyToMany z Produkt (właściciel relacji jest w Produkt)
    @ManyToMany(mappedBy = "skladnikiEntities") // Corrected mappedBy to match field in Produkt entity
    private Set<Produkt> produkty;

    // Constructor for creating Skladnik with nazwa
    public Skladnik(String nazwa) {
        this.nazwa = nazwa;
    }
}

