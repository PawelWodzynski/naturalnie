package com.auth.jwt.data.dto.app_data;

import com.auth.jwt.dto.app_data.ProduktDTO;
import com.auth.jwt.dto.app_data.ZdjecieDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ProduktAndZdjeciaDto {

    private ProduktDTO produkt;
    private List<ZdjecieDTO> zdjecia;

}

