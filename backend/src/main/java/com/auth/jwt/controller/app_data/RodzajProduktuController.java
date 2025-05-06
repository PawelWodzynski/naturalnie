package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.RodzajProduktu;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.RodzajProduktuService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/rodzaj-produktu")
public class RodzajProduktuController {

    private final RodzajProduktuService rodzajProduktuService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public RodzajProduktuController(RodzajProduktuService rodzajProduktuService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.rodzajProduktuService = rodzajProduktuService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllRodzajeProduktow(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            List<RodzajProduktu> rodzajeProduktow = rodzajProduktuService.getAllRodzajeProduktow();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę rodzajów produktów.", rodzajeProduktow));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/rodzaj-produktu (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu rodzajów produktów."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRodzajProduktuById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            RodzajProduktu rodzajProduktu = rodzajProduktuService.getRodzajProduktuById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("RodzajProduktu o ID " + id + " nie znaleziony."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano rodzaj produktu.", rodzajProduktu));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/rodzaj-produktu/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu rodzaju produktu."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRodzajProduktu(@RequestBody RodzajProduktu rodzajProduktu, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            RodzajProduktu createdRodzajProduktu = rodzajProduktuService.createRodzajProduktu(rodzajProduktu);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowy rodzaj produktu.", createdRodzajProduktu));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/rodzaj-produktu (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu rodzaju produktu."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRodzajProduktu(@PathVariable Integer id, @RequestBody RodzajProduktu rodzajProduktuDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            RodzajProduktu updatedRodzajProduktu = rodzajProduktuService.updateRodzajProduktu(id, rodzajProduktuDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano rodzaj produktu.", updatedRodzajProduktu));
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
            System.err.println("Błąd w endpoincie /api/app-data/rodzaj-produktu/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji rodzaju produktu."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRodzajProduktu(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            rodzajProduktuService.deleteRodzajProduktu(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto rodzaj produktu o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/rodzaj-produktu/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu rodzaju produktu."));
        }
    }
}

