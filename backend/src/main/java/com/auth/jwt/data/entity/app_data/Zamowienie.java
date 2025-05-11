package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "zamowienie")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zamowienie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zamowienie_id")
    private Long zamowienieId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "imie", nullable = false, length = 100)
    private String imie;

    @Column(name = "nazwisko", nullable = false, length = 100)
    private String nazwisko;

    @Column(name = "mail", nullable = false, length = 255)
    private String mail;

    @Column(name = "primary_address_id")
    private Integer primaryAddressId;

    @Column(name = "alternative_address_id")
    private Integer alternativeAddressId;

    @Column(name = "lista_id_produktow", columnDefinition = "TEXT")
    private String listaIdProduktow; // Przechowuje listę ID produktów w formacie JSON

    @Column(name = "laczna_cena", nullable = false, precision = 10, scale = 2)
    private BigDecimal lacznaCena;

    @Column(name = "data_dostawy")
    private LocalDate dataDostawy;

    @Column(name = "zrealizowane")
    private Boolean zrealizowane = false;
    
    @Column(name = "numer_transakcji", length = 50)
    private String numerTransakcji;

    @Column(name = "timestamp", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestamp;
}
