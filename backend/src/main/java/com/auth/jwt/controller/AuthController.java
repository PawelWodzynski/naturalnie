package com.auth.jwt.controller;

import com.auth.jwt.data.dto.authorization.CredentialsDto;
import com.auth.jwt.data.dto.employee.EmployeeDetailsDto; // Import the new DTO
import com.auth.jwt.data.dto.employee.RegisterEmployeeDto;
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.exception.AuthenticationException;
import com.auth.jwt.exception.RegistrationException;
import com.auth.jwt.exception.UserNotAuthenticatedException;
import com.auth.jwt.service.AuthService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ResponseUtil responseUtil;
    private final AuthUtil authUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CredentialsDto credentialsDto) {
        try {
            String token = authService.login(credentialsDto);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Login error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas logowania."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterEmployeeDto registerEmployeeDto) {
        try {
            String token = authService.register(registerEmployeeDto);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RegistrationException e) {
            return ResponseEntity.badRequest()
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Registration error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas rejestracji."));
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam String token) {
        try {
            Map<String, Object> validationResult = authService.validateTokenAndGetRoles(token);
            log.info("Token validation result: " + validationResult.toString());
            return ResponseEntity.ok(validationResult);
        } catch (Exception e) {
            log.error("Token validation error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("tokenValidity", false, "roles", Collections.emptyList(), "error", "Wystąpił błąd podczas walidacji tokenu."));
        }
    }

    @GetMapping("/get-user")
    public ResponseEntity<?> getUser(@RequestParam(required = true) String token) {
        try {
            Employee employee = authUtil.getAuthenticatedUserOrThrow();

            // Create and populate the DTO
            EmployeeDetailsDto employeeDetailsDto = new EmployeeDetailsDto();
            employeeDetailsDto.setFirstName(employee.getFirstName());
            employeeDetailsDto.setLastName(employee.getLastName());
            employeeDetailsDto.setEmail(employee.getEmail());
            employeeDetailsDto.setPrimaryAddress(employee.getPrimaryAddress());
            employeeDetailsDto.setAlternativeAddress(employee.getAlternativeAddress());

            return ResponseEntity.ok(responseUtil.createSuccessResponse(
                    "Success", employeeDetailsDto)); // Return the DTO

        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error in /get-user endpoint: " + e.getMessage());
            e.printStackTrace(); // Print stack trace for more details
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas przetwarzania żądania."));
        }
    }
}

