package com.auth.jwt.dto.app_data;

import com.auth.jwt.data.entity.app_data.Zdjecie;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ZdjecieDTO {

    private Integer id;
    private byte[] daneZdjecia;
    private String opis;
    private Integer kolejnosc;

    public ZdjecieDTO(Zdjecie zdjecie) {
        this.id = zdjecie.getId();
        this.daneZdjecia = zdjecie.getDaneZdjecia();
        this.opis = zdjecie.getOpis();
        this.kolejnosc = zdjecie.getKolejnosc();
    }
}

