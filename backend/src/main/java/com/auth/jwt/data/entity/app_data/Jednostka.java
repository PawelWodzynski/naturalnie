package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "jednostka", schema = "app_data")
@Data
public class Jednostka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jednostka_id")
    private Integer id;

    @Column(name = "nazwa", nullable = false, length = 50)
    private String nazwa;

    @Column(name = "skrot", nullable = false, length = 10)
    private String skrot;
}

