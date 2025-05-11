package com.auth.jwt.data.dto.app_data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZamowieniePaginatedDto {
    private List<ZamowienieDetailDto> zamowienia;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int pageSize;
}
