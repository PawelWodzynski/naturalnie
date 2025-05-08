package com.auth.jwt.dto.app_data;

import com.auth.jwt.data.entity.app_data.Skladnik;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SkladnikDTO {

    private Integer id;
    private String nazwa;

    public SkladnikDTO(Skladnik skladnik) {
        this.id = skladnik.getId();
        this.nazwa = skladnik.getNazwa();
    }
}

