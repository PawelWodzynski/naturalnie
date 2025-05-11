package com.auth.jwt.data.dto.app_data;

import com.auth.jwt.data.dto.address.AddressDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZamowienieDetailDto {
    private Long zamowienieId;
    private Long employeeId;
    private String imie;
    private String nazwisko;
    private String mail;
    private AddressDto address; // Either primary or alternative address
    private List<ZamowionyProduktDTO> produkty;
    private BigDecimal lacznaCena;
    private LocalDate dataDostawy;
    private Boolean zrealizowane;
    private String numerTransakcji;
    private LocalDateTime timestamp;
}
