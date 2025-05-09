package com.auth.jwt.data.dto.app_data;

import java.util.List;

public class ProduktAndZdjeciaPaginatedDto {

    private List<ProduktAndZdjeciaDto> produkty;
    private int pageQuantity;

    public ProduktAndZdjeciaPaginatedDto() {
    }

    public ProduktAndZdjeciaPaginatedDto(List<ProduktAndZdjeciaDto> produkty, int pageQuantity) {
        this.produkty = produkty;
        this.pageQuantity = pageQuantity;
    }

    public List<ProduktAndZdjeciaDto> getProdukty() {
        return produkty;
    }

    public void setProdukty(List<ProduktAndZdjeciaDto> produkty) {
        this.produkty = produkty;
    }

    public int getPageQuantity() {
        return pageQuantity;
    }

    public void setPageQuantity(int pageQuantity) {
        this.pageQuantity = pageQuantity;
    }
}

