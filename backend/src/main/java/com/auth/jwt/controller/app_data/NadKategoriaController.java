package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.NadKategoria;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.NadKategoriaService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/nad-kategoria")
public class NadKategoriaController {

    private final NadKategoriaService nadKategoriaService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public NadKategoriaController(NadKategoriaService nadKategoriaService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.nadKategoriaService = nadKategoriaService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllNadKategorie(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            List<NadKategoria> nadKategorie = nadKategoriaService.getAllNadKategorie();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę nadkategorii.", nadKategorie));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/nad-kategoria (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu nadkategorii."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNadKategoriaById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            NadKategoria nadKategoria = nadKategoriaService.getNadKategoriaById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("NadKategoria o ID " + id + " nie znaleziona."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano nadkategorię.", nadKategoria));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/nad-kategoria/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu nadkategorii."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createNadKategoria(@RequestBody NadKategoria nadKategoria, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            NadKategoria createdNadKategoria = nadKategoriaService.createNadKategoria(nadKategoria);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nową nadkategorię.", createdNadKategoria));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/nad-kategoria (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu nadkategorii."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNadKategoria(@PathVariable Integer id, @RequestBody NadKategoria nadKategoriaDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            NadKategoria updatedNadKategoria = nadKategoriaService.updateNadKategoria(id, nadKategoriaDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano nadkategorię.", updatedNadKategoria));
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
            System.err.println("Błąd w endpoincie /api/app-data/nad-kategoria/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji nadkategorii."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNadKategoria(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            nadKategoriaService.deleteNadKategoria(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto nadkategorię o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/nad-kategoria/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu nadkategorii."));
        }
    }
}

