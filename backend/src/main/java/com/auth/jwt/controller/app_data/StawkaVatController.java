package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.StawkaVat;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.StawkaVatService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/stawka-vat")
public class StawkaVatController {

    private final StawkaVatService stawkaVatService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public StawkaVatController(StawkaVatService stawkaVatService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.stawkaVatService = stawkaVatService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllStawkiVat(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            List<StawkaVat> stawkiVat = stawkaVatService.getAllStawkiVat();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę stawek VAT.", stawkiVat));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/stawka-vat (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu stawek VAT."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStawkaVatById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            StawkaVat stawkaVat = stawkaVatService.getStawkaVatById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("StawkaVat o ID " + id + " nie znaleziona."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano stawkę VAT.", stawkaVat));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/stawka-vat/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu stawki VAT."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createStawkaVat(@RequestBody StawkaVat stawkaVat, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            StawkaVat createdStawkaVat = stawkaVatService.createStawkaVat(stawkaVat);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nową stawkę VAT.", createdStawkaVat));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/stawka-vat (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu stawki VAT."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStawkaVat(@PathVariable Integer id, @RequestBody StawkaVat stawkaVatDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            StawkaVat updatedStawkaVat = stawkaVatService.updateStawkaVat(id, stawkaVatDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano stawkę VAT.", updatedStawkaVat));
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
            System.err.println("Błąd w endpoincie /api/app-data/stawka-vat/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji stawki VAT."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStawkaVat(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            stawkaVatService.deleteStawkaVat(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto stawkę VAT o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/stawka-vat/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu stawki VAT."));
        }
    }
}

