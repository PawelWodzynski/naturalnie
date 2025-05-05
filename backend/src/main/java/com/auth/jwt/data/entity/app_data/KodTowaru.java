package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;

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

    // Relacja OneToOne z Produkt (Produkt jest właścicielem)
    @OneToOne(mappedBy = "kodTowaru", fetch = FetchType.LAZY)
    private Produkt produkt;
}

