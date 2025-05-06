package com.auth.jwt.data.entity.app_data;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "opakowanie", schema = "app_data")
@Data
public class Opakowanie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "opakowanie_id")
    private Integer id;

    @Column(name = "nazwa", nullable = false, length = 100)
    private String nazwa;

    @Column(name = "skrot", length = 50)
    private String skrot;

    @Column(name = "opis", columnDefinition = "TEXT")
    private String opis;

    // Relacja OneToMany z Produkt
    @OneToMany(mappedBy = "opakowanie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("opakowanie-produkt")
    private List<Produkt> produkty;
}

