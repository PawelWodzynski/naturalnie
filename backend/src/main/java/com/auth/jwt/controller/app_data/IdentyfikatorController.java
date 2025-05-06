package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.Identyfikator;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.IdentyfikatorService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/identyfikator")
public class IdentyfikatorController {

    private final IdentyfikatorService identyfikatorService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public IdentyfikatorController(IdentyfikatorService identyfikatorService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.identyfikatorService = identyfikatorService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllIdentyfikatory(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            List<Identyfikator> identyfikatory = identyfikatorService.getAllIdentyfikatory();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę identyfikatorów.", identyfikatory));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/identyfikator (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu identyfikatorów."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getIdentyfikatorById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            Identyfikator identyfikator = identyfikatorService.getIdentyfikatorById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Identyfikator o ID " + id + " nie znaleziony."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano identyfikator.", identyfikator));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/identyfikator/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu identyfikatora."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createIdentyfikator(@RequestBody Identyfikator identyfikator, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            Identyfikator createdIdentyfikator = identyfikatorService.createIdentyfikator(identyfikator);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowy identyfikator.", createdIdentyfikator));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/identyfikator (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu identyfikatora."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIdentyfikator(@PathVariable Integer id, @RequestBody Identyfikator identyfikatorDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            Identyfikator updatedIdentyfikator = identyfikatorService.updateIdentyfikator(id, identyfikatorDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano identyfikator.", updatedIdentyfikator));
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
            System.err.println("Błąd w endpoincie /api/app-data/identyfikator/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji identyfikatora."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIdentyfikator(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            identyfikatorService.deleteIdentyfikator(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto identyfikator o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/identyfikator/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu identyfikatora."));
        }
    }
}

