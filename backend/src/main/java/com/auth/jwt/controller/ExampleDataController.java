package com.auth.jwt.controller;

import com.auth.jwt.data.entity.app_data.ExampleData;
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.exception.UserNotAuthenticatedException; // Import custom exception
import com.auth.jwt.service.ExampleDataService;
import com.auth.jwt.util.AuthUtil;
import com.auth.jwt.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/example")
public class ExampleDataController {

    // Dependencies injected via constructor
    private final ExampleDataService exampleDataService;
    private final AuthUtil authUtil;
    private final ResponseUtil responseUtil;

    @Autowired
    public ExampleDataController(ExampleDataService exampleDataService,
                                 AuthUtil authUtil,
                                 ResponseUtil responseUtil) {
        this.exampleDataService = exampleDataService;
        this.authUtil = authUtil;
        this.responseUtil = responseUtil;
    }

    /**
     * Test API authorization and fetch all example data.
     * Uses AuthUtil.getAuthenticatedUserOrThrow() for concise authentication check.
     * @param token JWT token (optional, authentication is primarily handled by filter)
     * @return Success with example data or Unauthorized/Error response.
     */
    @GetMapping("/test")
    public ResponseEntity<?> testApiAuthorization(@RequestParam(required = true) String token) {
        try {
            // 1. Get authenticated user or throw exception if not authenticated
            Employee employee = authUtil.getAuthenticatedUserOrThrow();

            // 2. Fetch data using ExampleDataService (only if authenticated)
            List<ExampleData> exampleDataList = exampleDataService.getAllExampleData();

            // 3. Create success response using ResponseUtil
            return ResponseEntity.ok(responseUtil.createSuccessResponse(
                    "Autoryzacja api działa dla użytkownika: " + employee.getUserName(),
                    exampleDataList
            ));

        } catch (UserNotAuthenticatedException e) {
            // 4. Handle specific authentication exception
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage())); // Use exception message
        } catch (Exception e) {
            // 5. Handle potential exceptions from the service layer or other unexpected errors
            // Log the exception for debugging purposes
            System.err.println("Error in apiMethodName: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas przetwarzania żądania."));
        }
    }
}

