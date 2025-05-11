package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.dto.address.AddressDto;
import com.auth.jwt.data.dto.app_data.ZamowienieDetailDto;
import com.auth.jwt.data.dto.app_data.ZamowienieDto;
import com.auth.jwt.data.dto.app_data.ZamowieniePaginatedDto;
import com.auth.jwt.data.dto.app_data.ZamowionyProduktDTO;
import com.auth.jwt.data.entity.app_data.Produkt;
import com.auth.jwt.data.entity.app_data.Zamowienie;
import com.auth.jwt.data.entity.auth.employee.Address;
import com.auth.jwt.data.entity.auth.employee.AlternativeAddress;
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.data.repository.app_data.ProduktRepository;
import com.auth.jwt.data.repository.app_data.ZamowienieRepository;
import com.auth.jwt.data.repository.auth.employee.AddressRepository;
import com.auth.jwt.data.repository.auth.employee.AlternativeAddressRepository;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/zamowienia")
@Slf4j
@RequiredArgsConstructor
public class ZamowienieController {

    private final ZamowienieRepository zamowienieRepository;
    private final ProduktRepository produktRepository;
    private final AddressRepository addressRepository;
    private final AlternativeAddressRepository alternativeAddressRepository;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;
    private final ObjectMapper objectMapper;

    /**
     * Creates a new order
     * 
     * @param token Authentication token
     * @param zamowienieDto Order data
     * @return ResponseEntity with success or error message
     */
    @PostMapping
    @Transactional("appDataTransactionManager")
    public ResponseEntity<?> createZamowienie(
            @RequestParam(required = true) String token,
            @RequestBody ZamowienieDto zamowienieDto) {
        try {
            // Get the authenticated user
            Employee employee = authUtil.getAuthenticatedUserOrThrow();
            
            // Create a new order
            Zamowienie zamowienie = new Zamowienie();
            
            // Set employee data
            zamowienie.setEmployeeId(employee.getId());
            zamowienie.setImie(zamowienieDto.getImie());
            zamowienie.setNazwisko(zamowienieDto.getNazwisko());
            zamowienie.setMail(zamowienieDto.getMail());
            
            // Set address IDs based on the useAlternativeAddress flag
            if (Boolean.TRUE.equals(zamowienieDto.getUseAlternativeAddress())) {
                if (employee.getAlternativeAddress() != null) {
                    zamowienie.setAlternativeAddressId(employee.getAlternativeAddress().getAddressId());
                } else {
                    return ResponseEntity.badRequest()
                            .body(responseUtil.createErrorResponse("Alternatywny adres nie istnieje."));
                }
            } else {
                if (employee.getPrimaryAddress() != null) {
                    zamowienie.setPrimaryAddressId(employee.getPrimaryAddress().getAddressId());
                } else {
                    return ResponseEntity.badRequest()
                            .body(responseUtil.createErrorResponse("Główny adres nie istnieje."));
                }
            }
            
            // Set order status to false (not completed)
            zamowienie.setZrealizowane(false);
            
            // Set delivery date
            zamowienie.setDataDostawy(zamowienieDto.getDataDostawy());
            
            // Set transaction number
            zamowienie.setNumerTransakcji(zamowienieDto.getNumerTransakcji());
            
            // Calculate total price and convert product map to JSON
            BigDecimal totalPrice = calculateTotalPrice(zamowienieDto.getProdukty());
            zamowienie.setLacznaCena(totalPrice);
            
            // Convert product map to JSON
            try {
                Map<String, String> produktyMap = new HashMap<>();
                for (Map.Entry<Integer, Integer> entry : zamowienieDto.getProdukty().entrySet()) {
                    produktyMap.put(entry.getKey().toString(), entry.getValue().toString());
                }
                zamowienie.setListaIdProduktow(objectMapper.writeValueAsString(produktyMap));
            } catch (JsonProcessingException e) {
                log.error("Error serializing product map to JSON", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(responseUtil.createErrorResponse("Błąd podczas przetwarzania listy produktów."));
            }
            
            // Save the order
            Zamowienie savedZamowienie = zamowienieRepository.save(zamowienie);
            
            return ResponseEntity.ok(responseUtil.createSuccessResponse(
                    "Zamówienie zostało utworzone pomyślnie.", savedZamowienie));
            
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating order: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas tworzenia zamówienia."));
        }
    }
    
    /**
     * Get all orders with pagination
     * 
     * @param token Authentication token
     * @param page Page number (0-based)
     * @param size Number of items per page
     * @return ResponseEntity with paginated orders
     */
    @GetMapping
    @Transactional("appDataTransactionManager")
    public ResponseEntity<?> getAllZamowienia(
            @RequestParam(required = true) String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Get the authenticated user
            authUtil.getAuthenticatedUserOrThrow();
            
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
            
            // Get paginated orders
            Page<Zamowienie> zamowieniaPage = zamowienieRepository.findAll(pageable);
            
            // Convert to DTOs
            List<ZamowienieDetailDto> zamowieniaDetailDtos = zamowieniaPage.getContent().stream()
                    .map(this::convertToDetailDto)
                    .collect(Collectors.toList());
            
            // Create paginated response
            ZamowieniePaginatedDto paginatedDto = ZamowieniePaginatedDto.builder()
                    .zamowienia(zamowieniaDetailDtos)
                    .totalPages(zamowieniaPage.getTotalPages())
                    .totalElements(zamowieniaPage.getTotalElements())
                    .currentPage(zamowieniaPage.getNumber())
                    .pageSize(zamowieniaPage.getSize())
                    .build();
            
            return ResponseEntity.ok(responseUtil.createSuccessResponse(
                    "Zamówienia zostały pobrane pomyślnie.", paginatedDto));
            
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Error getting orders: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas pobierania zamówień."));
        }
    }
    
    /**
     * Converts a Zamowienie entity to a ZamowienieDetailDto
     * 
     * @param zamowienie The Zamowienie entity
     * @return ZamowienieDetailDto
     */
    @Transactional("appDataTransactionManager")
    private ZamowienieDetailDto convertToDetailDto(Zamowienie zamowienie) {
        ZamowienieDetailDto dto = new ZamowienieDetailDto();
        
        // Set basic fields
        dto.setZamowienieId(zamowienie.getZamowienieId());
        dto.setEmployeeId(zamowienie.getEmployeeId());
        dto.setImie(zamowienie.getImie());
        dto.setNazwisko(zamowienie.getNazwisko());
        dto.setMail(zamowienie.getMail());
        dto.setLacznaCena(zamowienie.getLacznaCena());
        dto.setDataDostawy(zamowienie.getDataDostawy());
        dto.setZrealizowane(zamowienie.getZrealizowane());
        dto.setNumerTransakcji(zamowienie.getNumerTransakcji());
        dto.setTimestamp(zamowienie.getTimestamp());
        
        // Get address
        AddressDto addressDto = null;
        if (zamowienie.getPrimaryAddressId() != null) {
            Address address = addressRepository.findById(zamowienie.getPrimaryAddressId())
                    .orElse(null);
            if (address != null) {
                addressDto = mapAddressToDto(address);
            }
        } else if (zamowienie.getAlternativeAddressId() != null) {
            AlternativeAddress alternativeAddress = alternativeAddressRepository.findById(zamowienie.getAlternativeAddressId())
                    .orElse(null);
            if (alternativeAddress != null) {
                addressDto = mapAlternativeAddressToDto(alternativeAddress);
            }
        }
        dto.setAddress(addressDto);
        
        // Get products
        List<ZamowionyProduktDTO> produktyDtos = new ArrayList<>();
        try {
            if (zamowienie.getListaIdProduktow() != null) {
                Map<String, String> produktyMap = objectMapper.readValue(
                        zamowienie.getListaIdProduktow(), 
                        new TypeReference<Map<String, String>>() {});
                
                for (Map.Entry<String, String> entry : produktyMap.entrySet()) {
                    Integer produktId = Integer.parseInt(entry.getKey());
                    Integer quantity = Integer.parseInt(entry.getValue());
                    
                    Produkt produkt = produktRepository.findById(produktId)
                            .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + produktId + " nie znaleziony."));
                    
                    // Safely get related entity values
                    String kodEan = "";
                    String kodTowaru = "";
                    String identyfikator = "";
                    
                    try {
                        if (produkt.getKodEan() != null) {
                            kodEan = produkt.getKodEan().getKod();
                        }
                    } catch (Exception e) {
                        log.warn("Could not load KodEan for product ID {}: {}", produkt.getId(), e.getMessage());
                    }
                    
                    try {
                        if (produkt.getKodTowaru() != null) {
                            kodTowaru = produkt.getKodTowaru().getKod();
                        }
                    } catch (Exception e) {
                        log.warn("Could not load KodTowaru for product ID {}: {}", produkt.getId(), e.getMessage());
                    }
                    
                    try {
                        if (produkt.getIdentyfikator() != null) {
                            identyfikator = produkt.getIdentyfikator().getWartosc();
                        }
                    } catch (Exception e) {
                        log.warn("Could not load Identyfikator for product ID {}: {}", produkt.getId(), e.getMessage());
                    }
                    
                    ZamowionyProduktDTO produktDto = ZamowionyProduktDTO.builder()
                            .produktId(produkt.getId())
                            .nazwa(produkt.getNazwa())
                            .kodEan(kodEan)
                            .kodTowaru(kodTowaru)
                            .identyfikator(identyfikator)
                            .waga(produkt.getWaga())
                            .ilosc(quantity)
                            .cenaJednostkowa(produkt.getCena())
                            .cenaLaczna(produkt.getCena().multiply(new BigDecimal(quantity)))
                            .build();
                    
                    produktyDtos.add(produktDto);
                }
            }
        } catch (ResourceNotFoundException e) {
            log.error("Product not found for order ID {}: {}", zamowienie.getZamowienieId(), e.getMessage());
            throw e; // Re-throw to be handled by the controller
        } catch (Exception e) {
            log.error("Error parsing product list for order ID {}: {}", zamowienie.getZamowienieId(), e.getMessage());
            throw new RuntimeException("Błąd podczas przetwarzania listy produktów dla zamówienia ID " + 
                    zamowienie.getZamowienieId(), e);
        }
        
        // Ensure the product list is never empty
        if (produktyDtos.isEmpty()) {
            log.warn("No products found for order ID {}", zamowienie.getZamowienieId());
            throw new ResourceNotFoundException("Nie znaleziono produktów dla zamówienia ID " + 
                    zamowienie.getZamowienieId());
        }
        
        dto.setProdukty(produktyDtos);
        
        return dto;
    }
    
    /**
     * Maps an Address entity to an AddressDto
     * 
     * @param address The Address entity
     * @return AddressDto
     */
    private AddressDto mapAddressToDto(Address address) {
        AddressDto dto = new AddressDto();
        dto.setStreet(address.getStreet());
        dto.setBuildingNumber(address.getBuildingNumber());
        dto.setApartmentNumber(address.getApartmentNumber());
        dto.setPostalCode(address.getPostalCode());
        dto.setCity(address.getCity());
        dto.setVoivodeship(address.getVoivodeship());
        dto.setDistrict(address.getDistrict());
        dto.setCommune(address.getCommune());
        dto.setPhoneNumber(address.getPhoneNumber());
        dto.setNip(address.getNip());
        dto.setCompanyName(address.getCompanyName());
        return dto;
    }
    
    /**
     * Maps an AlternativeAddress entity to an AddressDto
     * 
     * @param address The AlternativeAddress entity
     * @return AddressDto
     */
    private AddressDto mapAlternativeAddressToDto(AlternativeAddress address) {
        AddressDto dto = new AddressDto();
        dto.setStreet(address.getStreet());
        dto.setBuildingNumber(address.getBuildingNumber());
        dto.setApartmentNumber(address.getApartmentNumber());
        dto.setPostalCode(address.getPostalCode());
        dto.setCity(address.getCity());
        dto.setVoivodeship(address.getVoivodeship());
        dto.setDistrict(address.getDistrict());
        dto.setCommune(address.getCommune());
        dto.setPhoneNumber(address.getPhoneNumber());
        dto.setNip(address.getNip());
        dto.setCompanyName(address.getCompanyName());
        return dto;
    }
    
    /**
     * Calculates the total price of the order by summing up the prices of all products
     * multiplied by their quantities
     * 
     * @param produkty Map of product IDs to quantities
     * @return Total price
     */
    private BigDecimal calculateTotalPrice(Map<Integer, Integer> produkty) {
        BigDecimal totalPrice = BigDecimal.ZERO;
        
        for (Map.Entry<Integer, Integer> entry : produkty.entrySet()) {
            Integer produktId = entry.getKey();
            Integer quantity = entry.getValue();
            
            Produkt produkt = produktRepository.findById(produktId)
                    .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + produktId + " nie znaleziony."));
            
            BigDecimal productPrice = produkt.getCena();
            BigDecimal quantityBD = new BigDecimal(quantity);
            
            totalPrice = totalPrice.add(productPrice.multiply(quantityBD));
        }
        
        return totalPrice;
    }
}
