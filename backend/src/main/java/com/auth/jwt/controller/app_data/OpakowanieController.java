package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.Opakowanie;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.OpakowanieService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/opakowanie")
public class OpakowanieController {

    private final OpakowanieService opakowanieService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public OpakowanieController(OpakowanieService opakowanieService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.opakowanieService = opakowanieService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllOpakowania(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            List<Opakowanie> opakowania = opakowanieService.getAllOpakowania();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę opakowań.", opakowania));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/opakowanie (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu opakowań."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOpakowanieById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            Opakowanie opakowanie = opakowanieService.getOpakowanieById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Opakowanie o ID " + id + " nie znalezione."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano opakowanie.", opakowanie));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/opakowanie/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu opakowania."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createOpakowanie(@RequestBody Opakowanie opakowanie, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            Opakowanie createdOpakowanie = opakowanieService.createOpakowanie(opakowanie);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowe opakowanie.", createdOpakowanie));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/opakowanie (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu opakowania."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOpakowanie(@PathVariable Integer id, @RequestBody Opakowanie opakowanieDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            Opakowanie updatedOpakowanie = opakowanieService.updateOpakowanie(id, opakowanieDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano opakowanie.", updatedOpakowanie));
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
            System.err.println("Błąd w endpoincie /api/app-data/opakowanie/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji opakowania."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOpakowanie(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(token);
            opakowanieService.deleteOpakowanie(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto opakowanie o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/opakowanie/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu opakowania."));
        }
    }
}

