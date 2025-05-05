package com.auth.jwt.data.entity.app_data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "example_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExampleData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_cell_1")
    private Integer dataCell1;

    @Column(name = "data_cell_2", length = 20)
    private String dataCell2;

    @Column(name = "timestamp_cell", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestampCell;
}