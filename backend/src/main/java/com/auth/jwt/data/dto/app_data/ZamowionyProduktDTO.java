package com.auth.jwt.data.dto.app_data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for ordered products with detailed information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZamowionyProduktDTO {
    private Integer produktId;
    private String nazwa;
    private String kodEan;
    private String kodTowaru;
    private String identyfikator;
    private BigDecimal waga;
    private Integer ilosc;
    private BigDecimal cenaJednostkowa;
    private BigDecimal cenaLaczna; // cenaJednostkowa * ilosc
}
