package com.auth.jwt.dto.app_data;

import lombok.Data;

@Data
public class ZdjecieRequestDTO {
    private String nazwa; // Added field
    private String base64; // Added field
    private byte[] daneZdjecia;
    private String opis;
    private Integer kolejnosc;
}

