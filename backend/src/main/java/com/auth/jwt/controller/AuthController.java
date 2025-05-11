package com.auth.jwt.controller;

import com.auth.jwt.data.dto.address.AddressDto; // Import AddressDto
import com.auth.jwt.data.dto.address.AddressUpdateDto; // Import AddressUpdateDto
import com.auth.jwt.data.dto.authorization.CredentialsDto;
import com.auth.jwt.data.dto.employee.EmployeeDetailsDto;
import com.auth.jwt.data.dto.employee.RegisterEmployeeDto;
import com.auth.jwt.data.entity.auth.employee.Address; // For mapping
import com.auth.jwt.data.entity.auth.employee.AlternativeAddress; // For mapping
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.data.repository.auth.employee.AddressRepository;
import com.auth.jwt.data.repository.auth.employee.AlternativeAddressRepository;
import com.auth.jwt.exception.AuthenticationException;
import com.auth.jwt.exception.RegistrationException;
import com.auth.jwt.exception.ResourceNotFoundException;
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
    private final AddressRepository addressRepository;
    private final AlternativeAddressRepository alternativeAddressRepository;

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

    private AddressDto mapAddressEntityToDto(Address addressEntity) {
        if (addressEntity == null) {
            return null;
        }
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet(addressEntity.getStreet());
        addressDto.setBuildingNumber(addressEntity.getBuildingNumber());
        addressDto.setApartmentNumber(addressEntity.getApartmentNumber());
        addressDto.setPostalCode(addressEntity.getPostalCode());
        addressDto.setCity(addressEntity.getCity());
        addressDto.setVoivodeship(addressEntity.getVoivodeship());
        addressDto.setDistrict(addressEntity.getDistrict());
        addressDto.setCommune(addressEntity.getCommune());
        addressDto.setPhoneNumber(addressEntity.getPhoneNumber());
        addressDto.setNip(addressEntity.getNip());
        addressDto.setCompanyName(addressEntity.getCompanyName());
        return addressDto;
    }

    private AddressDto mapAlternativeAddressEntityToDto(AlternativeAddress alternativeAddressEntity) {
        if (alternativeAddressEntity == null) {
            return null;
        }
        // Assuming AlternativeAddress has the same fields as Address for DTO mapping
        // If AlternativeAddress has a different structure, a separate DTO or mapping logic might be needed.
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet(alternativeAddressEntity.getStreet());
        addressDto.setBuildingNumber(alternativeAddressEntity.getBuildingNumber());
        addressDto.setApartmentNumber(alternativeAddressEntity.getApartmentNumber());
        addressDto.setPostalCode(alternativeAddressEntity.getPostalCode());
        addressDto.setCity(alternativeAddressEntity.getCity());
        addressDto.setVoivodeship(alternativeAddressEntity.getVoivodeship());
        addressDto.setDistrict(alternativeAddressEntity.getDistrict());
        addressDto.setCommune(alternativeAddressEntity.getCommune());
        addressDto.setPhoneNumber(alternativeAddressEntity.getPhoneNumber());
        addressDto.setNip(alternativeAddressEntity.getNip());
        addressDto.setCompanyName(alternativeAddressEntity.getCompanyName());
        return addressDto;
    }

    /**
     * Updates the address (primary or alternative) of the authenticated user.
     * 
     * @param alternative If true, updates the alternative address; if false, updates the primary address
     * @param addressUpdateDto The DTO containing the updated address information
     * @return ResponseEntity with success or error message
     */
    @PutMapping("/update-address")
    public ResponseEntity<?> updateAddress(
            @RequestParam(required = true) String token,
            @RequestParam(required = true) boolean alternative,
            @RequestBody AddressUpdateDto addressUpdateDto) {
        try {
            // Get the authenticated user
            Employee employee = authUtil.getAuthenticatedUserOrThrow();
            
            if (alternative) {
                // Update alternative address
                AlternativeAddress alternativeAddress = employee.getAlternativeAddress();
                
                // If alternative address doesn't exist, create a new one
                if (alternativeAddress == null) {
                    alternativeAddress = new AlternativeAddress();
                    // No need to set employeeId as it's not used in AlternativeAddress
                }
                
                // Update the alternative address fields
                updateAlternativeAddressFromDto(alternativeAddress, addressUpdateDto);
                
                // Save the updated alternative address
                AlternativeAddress savedAddress = alternativeAddressRepository.save(alternativeAddress);
                
                // Update the employee's reference to the alternative address
                employee.setAlternativeAddress(savedAddress);
                
                return ResponseEntity.ok(responseUtil.createSuccessResponse(
                        "Adres alternatywny został zaktualizowany pomyślnie.", 
                        mapAlternativeAddressEntityToDto(savedAddress)));
            } else {
                // Update primary address
                Address primaryAddress = employee.getPrimaryAddress();
                
                // If primary address doesn't exist, create a new one
                if (primaryAddress == null) {
                    primaryAddress = new Address();
                    primaryAddress.setEmployeeId(employee.getId());
                }
                
                // Update the primary address fields
                updateAddressFromDto(primaryAddress, addressUpdateDto);
                
                // Save the updated primary address
                Address savedAddress = addressRepository.save(primaryAddress);
                
                // Update the employee's reference to the primary address
                employee.setPrimaryAddress(savedAddress);
                
                return ResponseEntity.ok(responseUtil.createSuccessResponse(
                        "Adres główny został zaktualizowany pomyślnie.", 
                        mapAddressEntityToDto(savedAddress)));
            }
        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error in /update-address endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas aktualizacji adresu."));
        }
    }
    
    /**
     * Updates an Address entity with values from the DTO
     */
    private void updateAddressFromDto(Address address, AddressUpdateDto dto) {
        address.setStreet(dto.getStreet());
        address.setBuildingNumber(dto.getBuildingNumber());
        address.setApartmentNumber(dto.getApartmentNumber());
        address.setPostalCode(dto.getPostalCode());
        address.setCity(dto.getCity());
        address.setVoivodeship(dto.getVoivodeship());
        address.setDistrict(dto.getDistrict());
        address.setCommune(dto.getCommune());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setNip(dto.getNip());
        address.setCompanyName(dto.getCompanyName());
    }
    
    /**
     * Updates an AlternativeAddress entity with values from the DTO
     */
    private void updateAlternativeAddressFromDto(AlternativeAddress address, AddressUpdateDto dto) {
        address.setStreet(dto.getStreet());
        address.setBuildingNumber(dto.getBuildingNumber());
        address.setApartmentNumber(dto.getApartmentNumber());
        address.setPostalCode(dto.getPostalCode());
        address.setCity(dto.getCity());
        address.setVoivodeship(dto.getVoivodeship());
        address.setDistrict(dto.getDistrict());
        address.setCommune(dto.getCommune());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setNip(dto.getNip());
        address.setCompanyName(dto.getCompanyName());
    }

    @GetMapping("/get-user")
    public ResponseEntity<?> getUser(@RequestParam(required = true) String token) {
        try {
            Employee employee = authUtil.getAuthenticatedUserOrThrow();

            EmployeeDetailsDto employeeDetailsDto = new EmployeeDetailsDto();
            employeeDetailsDto.setFirstName(employee.getFirstName());
            employeeDetailsDto.setLastName(employee.getLastName());
            employeeDetailsDto.setEmail(employee.getEmail());

            // Map Address entity to AddressDto
            if (employee.getPrimaryAddress() != null) {
                employeeDetailsDto.setPrimaryAddress(mapAddressEntityToDto(employee.getPrimaryAddress()));
            }

            // Map AlternativeAddress entity to AddressDto
            if (employee.getAlternativeAddress() != null) {
                employeeDetailsDto.setAlternativeAddress(mapAlternativeAddressEntityToDto(employee.getAlternativeAddress()));
            }

            return ResponseEntity.ok(responseUtil.createSuccessResponse(
                    "Success", employeeDetailsDto));

        } catch (UserNotAuthenticatedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(responseUtil.createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error in /get-user endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera podczas przetwarzania żądania."));
        }
    }
}
