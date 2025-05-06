package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.Produkt;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.ProduktService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            authUtil.getAuthenticatedUserOrThrow(token);
            List<Produkt> produkty = produktService.getAllProdukty();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę produktów.", produkty));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/produkt (GET): " + e.getMessage());
            e.printStackTrace(); // Detailed stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu produktów."));
        }
    }

    @GetMapping("/paginated")
    public ResponseEntity<?> getAllProduktyPaginated(
            @RequestParam(required = true) String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Integer nadKategoriaId,
            @RequestParam(required = false, defaultValue = "id,asc") String[] sort) { // Added sorting
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            
            // Handle sorting
            Sort.Direction direction = Sort.Direction.fromString(sort.length > 1 ? sort[1] : "asc");
            Sort.Order order = new Sort.Order(direction, sort[0]);
            Pageable pageable = PageRequest.of(page, size, Sort.by(order));

            Page<Produkt> produktyPage = produktService.getAllProduktyPaginated(pageable, nadKategoriaId);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano paginowaną listę produktów.", produktyPage));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) { // Catch issues like invalid sort direction
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
            authUtil.getAuthenticatedUserOrThrow(token);
            Produkt produkt = produktService.getProduktById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Produkt o ID " + id + " nie znaleziony."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano produkt.", produkt));
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
    public ResponseEntity<?> createProdukt(@RequestBody Produkt produkt, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            Produkt createdProdukt = produktService.createProdukt(produkt);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowy produkt wraz z powiązaniami.", createdProdukt));
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
    public ResponseEntity<?> updateProdukt(@PathVariable Integer id, @RequestBody Produkt produktDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            Produkt updatedProdukt = produktService.updateProdukt(id, produktDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano produkt.", updatedProdukt));
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
            authUtil.getAuthenticatedUserOrThrow(token);
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

