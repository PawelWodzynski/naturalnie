package com.auth.jwt.data.entity.app_data;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "stawka_vat", schema = "app_data")
@Data
public class StawkaVat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stawka_vat_id")
    private Integer id;

    @Column(name = "wartosc", nullable = false, precision = 5, scale = 2)
    private BigDecimal wartosc;

    // Relacja OneToMany z Produkt
    @OneToMany(mappedBy = "stawkaVat", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("stawkavat-produkt")
    private List<Produkt> produkty;
}

