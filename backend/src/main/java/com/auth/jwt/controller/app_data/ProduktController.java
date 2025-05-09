package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.dto.app_data.ProduktAndZdjeciaDto;
import com.auth.jwt.data.dto.app_data.ProduktAndZdjeciaPaginatedDto;
import com.auth.jwt.data.entity.app_data.Produkt;
import com.auth.jwt.dto.app_data.ProduktDTO; // Response DTO
import com.auth.jwt.dto.app_data.ProduktRequestDTO; // Request DTO
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.ProduktService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/app-data/produkt")
public class ProduktController {

    private final ProduktService produktService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public ProduktController(ProduktService produktService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.produktService = produktService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllProdukty(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            List<ProduktDTO> produktyDTO = produktService.getAllProdukty().stream()
                    .map(ProduktDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę produktów.", produktyDTO));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/produkt (GET): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu produktów."));
        }
    }

    @Transactional(value = "appDataTransactionManager", readOnly = true)
    @GetMapping("/paginated")
    public ResponseEntity<?> getAllProduktyPaginated(
            @RequestParam(required = true) String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Integer nadKategoriaId,
            @RequestParam(required = false) Integer rodzajProduktuId,
            @RequestParam(required = false) String searchTerm, // Added searchTerm parameter
            @RequestParam(required = false, defaultValue = "id,asc") String[] sort) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            
            Sort.Direction direction = Sort.Direction.fromString(sort.length > 1 ? sort[1] : "asc");
            Sort.Order order = new Sort.Order(direction, sort[0]);
            Pageable pageable = PageRequest.of(page, size, Sort.by(order));

            // Pass searchTerm to the service method
            ProduktAndZdjeciaPaginatedDto produktyPage = produktService.getAllProduktyPaginated(pageable, nadKategoriaId, rodzajProduktuId, searchTerm);

            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano paginowaną listę produktów.", produktyPage));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) { 
             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse("Nieprawidłowe parametry żądania: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/produkt/paginated (GET): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu paginowanych produktów."));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getProduktById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            Produkt produkt = produktService.getProduktById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
            ProduktDTO produktDTO = new ProduktDTO(produkt);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano produkt.", produktDTO));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/produkt/{id} (GET): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu produktu."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProdukt(@RequestBody ProduktRequestDTO produktRequestDTO, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            Produkt createdProdukt = produktService.createProdukt(produktRequestDTO); // Changed to use DTO
            ProduktDTO createdProduktDTO = new ProduktDTO(createdProdukt);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowy produkt wraz z powiązaniami.", createdProduktDTO));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException | ResourceNotFoundException e) { 
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/produkt (POST): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu produktu."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProdukt(@PathVariable Integer id, @RequestBody ProduktRequestDTO produktRequestDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            Produkt updatedProdukt = produktService.updateProdukt(id, produktRequestDetails); // Changed to use DTO
            ProduktDTO updatedProduktDTO = new ProduktDTO(updatedProdukt);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano produkt.", updatedProduktDTO));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/produkt/{id} (PUT): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji produktu."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProdukt(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            produktService.deleteProdukt(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto produkt o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/produkt/{id} (DELETE): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu produktu."));
        }
    }
}

