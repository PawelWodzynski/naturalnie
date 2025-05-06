package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.entity.app_data.KodTowaru;
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.KodTowaruService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/kod-towaru")
public class KodTowaruController {

    private final KodTowaruService kodTowaruService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public KodTowaruController(KodTowaruService kodTowaruService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.kodTowaruService = kodTowaruService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllKodyTowarow(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            List<KodTowaru> kodyTowarow = kodTowaruService.getAllKodyTowarow();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę kodów towarów.", kodyTowarow));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-towaru (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu kodów towarów."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getKodTowaruById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            KodTowaru kodTowaru = kodTowaruService.getKodTowaruById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("KodTowaru o ID " + id + " nie znaleziony."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano kod towaru.", kodTowaru));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-towaru/{id} (GET): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu kodu towaru."));
        }
    }

    @PostMapping
    public ResponseEntity<?> createKodTowaru(@RequestBody KodTowaru kodTowaru, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            KodTowaru createdKodTowaru = kodTowaruService.createKodTowaru(kodTowaru);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowy kod towaru.", createdKodTowaru));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-towaru (POST): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu kodu towaru."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateKodTowaru(@PathVariable Integer id, @RequestBody KodTowaru kodTowaruDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            KodTowaru updatedKodTowaru = kodTowaruService.updateKodTowaru(id, kodTowaruDetails);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano kod towaru.", updatedKodTowaru));
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
            System.err.println("Błąd w endpoincie /api/app-data/kod-towaru/{id} (PUT): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji kodu towaru."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKodTowaru(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow(); // Fixed
            kodTowaruService.deleteKodTowaru(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto kod towaru o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/kod-towaru/{id} (DELETE): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu kodu towaru."));
        }
    }
}

