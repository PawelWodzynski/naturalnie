package com.auth.jwt.data.dto.app_data;

import com.auth.jwt.data.entity.app_data.Produkt;
import com.auth.jwt.data.entity.app_data.Zdjecie;
import lombok.Data;

import java.util.List;

@Data
public class ProduktAndZdjeciaDto {

    private Produkt produkt;
    private List<Zdjecie> zdjecia;


}
