package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode; // Added for consistency
import lombok.ToString; // Added for consistency
import java.util.List; // Import List

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

    // Changed to OneToMany as one Identyfikator can be associated with multiple Produkty
    @OneToMany(mappedBy = "identyfikator", fetch = FetchType.LAZY)
    @ToString.Exclude // Added for consistency
    @EqualsAndHashCode.Exclude // Added for consistency
    private List<Produkt> produkty; // Changed from Produkt to List<Produkt>
}
