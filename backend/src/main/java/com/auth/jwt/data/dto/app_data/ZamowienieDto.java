package com.auth.jwt.data.dto.app_data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZamowienieDto {

    private String imie;
    private String nazwisko;
    private String mail;
    
    // If true, use alternative address; if false or null, use primary address
    private Boolean useAlternativeAddress;
    
    // Map of product IDs to quantities (key = product_id, value = quantity)
    private Map<Integer, Integer> produkty;
    
    private LocalDate dataDostawy;
    
    private String numerTransakcji;
}
