package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode; // Added for consistency
import lombok.ToString; // Added for consistency
import java.util.List; // Import List

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

    // Changed to OneToMany as one KodEan can be associated with multiple Produkty
    @OneToMany(mappedBy = "kodEan", fetch = FetchType.LAZY)
    @ToString.Exclude // Added for consistency
    @EqualsAndHashCode.Exclude // Added for consistency
    private List<Produkt> produkty; // Changed from Produkt to List<Produkt>
}
