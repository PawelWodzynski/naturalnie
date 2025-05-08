package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List; // Import List

@Entity
@Table(name = "kod_towaru", schema = "app_data")
@Data
public class KodTowaru {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kod_towaru_id")
    private Integer id;

    @Column(name = "kod", nullable = false, unique = true, length = 20)
    private String kod;

    // Changed to OneToMany as one KodTowaru can be associated with multiple Produkty
    @OneToMany(mappedBy = "kodTowaru", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Produkt> produkty; // Changed from Produkt to List<Produkt>
}
