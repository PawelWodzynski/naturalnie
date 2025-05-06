package com.auth.jwt.dto.app_data;

import lombok.Data;

@Data
public class ZdjecieRequestDTO {
    private byte[] daneZdjecia;
    private String opis;
    private Integer kolejnosc;
}

