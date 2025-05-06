package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.KodEan;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.KodEanService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/kod-ean")
public class KodEanController {

    private final KodEanService kodEanService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public KodEanController(KodEanService kodEanService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.kodEanService = kodEanService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllKodyEan(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            List<KodEan> kodyEan = kodEanService.getAllKodyEan();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę kodów EAN.", kodyEan));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-ean (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu kodów EAN."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getKodEanById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            KodEan kodEan = kodEanService.getKodEanById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("KodEan o ID " + id + " nie znaleziony."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano kod EAN.", kodEan));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-ean/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu kodu EAN."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createKodEan(@RequestBody KodEan kodEan, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            KodEan createdKodEan = kodEanService.createKodEan(kodEan);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowy kod EAN.", createdKodEan));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-ean (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu kodu EAN."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateKodEan(@PathVariable Integer id, @RequestBody KodEan kodEanDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            KodEan updatedKodEan = kodEanService.updateKodEan(id, kodEanDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano kod EAN.", updatedKodEan));
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
            System.err.println("Błąd w endpoincie /api/app-data/kod-ean/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji kodu EAN."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKodEan(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            kodEanService.deleteKodEan(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto kod EAN o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-ean/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu kodu EAN."));
        }
    }
}

