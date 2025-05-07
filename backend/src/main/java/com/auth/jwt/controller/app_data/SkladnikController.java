package com.auth.jwt.controller.app_data;

import com.auth.jwt.data.dto.app_data.SkladnikDto;
import com.auth.jwt.data.entity.app_data.Skladnik; // Keep for POST/PUT if they still use Skladnik entity directly
import com.auth.jwt.exception.ResourceNotFoundException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.app_data.SkladnikService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-data/skladnik")
public class SkladnikController {

    private final SkladnikService skladnikService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public SkladnikController(SkladnikService skladnikService, AuthUtil authUtil, ResponseUtil responseUtil) {
        this.skladnikService = skladnikService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllSkladniki(@RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            // Updated to call the method returning List<SkladnikDto>
            List<SkladnikDto> skladnikiDto = skladnikService.getAllSkladniki();
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano listę składników.", skladnikiDto));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/skladnik (GET): " + e.getMessage());
            e.printStackTrace(); // It's good to print stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu składników."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSkladnikById(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            // Using the new service method that returns Optional<SkladnikDto>
            SkladnikDto skladnikDto = skladnikService.getSkladnikDtoById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Skladnik o ID " + id + " nie znaleziony."));
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Pobrano składnik.", skladnikDto));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/skladnik/{id} (GET): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy pobieraniu składnika."));
        }
    }

    // POST, PUT, DELETE methods remain largely the same if they operate on Skladnik entity directly for creation/update
    // and don't need to return the full Skladnik with its lazy collections in the response body.
    // If they *do* return the created/updated entity, they should also be changed to return DTOs.
    // For now, assuming they return the entity as before, or a simple success message.

    @PostMapping
    public ResponseEntity<?> createSkladnik(@RequestBody Skladnik skladnik, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            Skladnik createdSkladnikEntity = skladnikService.createSkladnik(skladnik);
            // Convert to DTO before sending in response
            SkladnikDto createdSkladnikDto = new SkladnikDto(createdSkladnikEntity.getId(), createdSkladnikEntity.getNazwa());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseUtil.createSuccessResponse("Utworzono nowy składnik.", createdSkladnikDto));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/skladnik (POST): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy tworzeniu składnika."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSkladnik(@PathVariable Integer id, @RequestBody Skladnik skladnikDetails, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            Skladnik updatedSkladnikEntity = skladnikService.updateSkladnik(id, skladnikDetails);
            // Convert to DTO before sending in response
            SkladnikDto updatedSkladnikDto = new SkladnikDto(updatedSkladnikEntity.getId(), updatedSkladnikEntity.getNazwa());
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Zaktualizowano składnik.", updatedSkladnikDto));
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
            System.err.println("Błąd w endpoincie /api/app-data/skladnik/{id} (PUT): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy aktualizacji składnika."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkladnik(@PathVariable Integer id, @RequestParam(required = true) String token) {
        try {
            authUtil.getAuthenticatedUserOrThrow();
            skladnikService.deleteSkladnik(id);
            return ResponseEntity.ok(responseUtil.createSuccessResponse("Usunięto składnik o ID " + id + ".", null));
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Błąd w endpoincie /api/app-data/skladnik/{id} (DELETE): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera przy usuwaniu składnika."));
        }
    }
}

