package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.Zdjecie;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.ZdjecieService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/zdjecie")
public class ZdjecieController {

    private final ZdjecieService zdjecieService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public ZdjecieController(ZdjecieService zdjecieService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.zdjecieService = zdjecieService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllZdjecia(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            List<Zdjecie> zdjecia = zdjecieService.getAllZdjecia();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę zdjęć.", zdjecia));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/zdjecie (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu zdjęć."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getZdjecieById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            Zdjecie zdjecie = zdjecieService.getZdjecieById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Zdjecie o ID " + id + " nie znalezione."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano zdjęcie.", zdjecie));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/zdjecie/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu zdjęcia."));
        }
    }

    @GetMapping("/produkt/{produktId}")
    public ResponseEntity<?> getZdjeciaByProduktId(@PathVariable Integer produktId, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            List<Zdjecie> zdjecia = zdjecieService.getZdjeciaByProduktId(produktId);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano zdjęcia dla produktu o ID " + produktId + ".", zdjecia));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/zdjecie/produkt/{produktId} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu zdjęć dla produktu."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createZdjecie(@RequestBody Zdjecie zdjecie, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            // Ensure Produkt is set for the Zdjecie before creation, or handle it appropriately
            if (zdjecie.getProdukt() == null || zdjecie.getProdukt().getId() == null) {
                throw new IllegalArgumentException("Produkt ID musi być ustawione dla zdjęcia.");
            }
            Zdjecie createdZdjecie = zdjecieService.createZdjecie(zdjecie);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowe zdjęcie.", createdZdjecie));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/zdjecie (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu zdjęcia."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateZdjecie(@PathVariable Integer id, @RequestBody Zdjecie zdjecieDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            Zdjecie updatedZdjecie = zdjecieService.updateZdjecie(id, zdjecieDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano zdjęcie.", updatedZdjecie));
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
            System.err.println("Błąd w endpoincie /api/app-data/zdjecie/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji zdjęcia."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteZdjecie(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            zdjecieService.deleteZdjecie(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto zdjęcie o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/zdjecie/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu zdjęcia."));
        }
    }
}

