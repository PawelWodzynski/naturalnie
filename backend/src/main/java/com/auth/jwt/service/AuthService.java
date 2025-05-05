package com.auth.jwt.service;

import com.auth.jwt.data.dto.authorization.CredentialsDto;
import com.auth.jwt.data.dto.employee.RegisterEmployeeDto;
import com.auth.jwt.data.entity.auth.employee.Address;
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.data.entity.auth.employee.EmployeeConsent;
import com.auth.jwt.data.entity.auth.employee.Role;
import com.auth.jwt.data.repository.auth.employee.AddressRepository; // Import AddressRepository
import com.auth.jwt.data.repository.auth.employee.EmployeeConsentRepository; // Import EmployeeConsentRepository
import com.auth.jwt.data.repository.auth.employee.EmployeeJpaRepository;
import com.auth.jwt.exception.RegistrationException;
import com.auth.jwt.exception.AuthenticationException;
import com.auth.jwt.security.UserAuthProvider;
import com.auth.jwt.util.ValidationUtil;
import org.springframework.transaction.annotation.Transactional; // Import Spring Transactional

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Import Slf4j
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j // Add Slf4j annotation for logging
public class AuthService {

    private final EmployeeJpaRepository employeeRepository;
    private final AddressRepository addressRepository; // Inject AddressRepository
    private final EmployeeConsentRepository consentRepository; // Inject EmployeeConsentRepository
    private final PasswordEncoder passwordEncoder;
    private final UserAuthProvider userAuthProvider;
    private final ValidationUtil validationUtil;

    public String login(CredentialsDto credentialsDto) throws AuthenticationException {
        Employee employee = employeeRepository.findByLogin(credentialsDto.getLogin());
        if (employee == null || !passwordEncoder.matches(String.valueOf(credentialsDto.getPassword()), employee.getPassword())) {
            throw new AuthenticationException("Nieprawidłowy login lub hasło");
        }
        return userAuthProvider.createToken(employee.getUserName());
    }

    @Transactional("authTransactionManager") // Specify the transaction manager
    public String register(RegisterEmployeeDto registerEmployeeDto) throws RegistrationException {
        // 0. Check if passwords match (trimming whitespace)
        String password = registerEmployeeDto.getPassword();
        String confirmPassword = registerEmployeeDto.getConfirmPassword();

        // Add Debug Logging
        log.debug("Password validation: Raw password='{}' (length={}), Raw confirmPassword='{}' (length={})", 
                  password, (password != null ? password.length() : "null"), 
                  confirmPassword, (confirmPassword != null ? confirmPassword.length() : "null"));
        
        String trimmedPassword = (password != null) ? password.trim() : null;
        String trimmedConfirmPassword = (confirmPassword != null) ? confirmPassword.trim() : null;

        log.debug("Password validation: Trimmed password='{}' (length={}), Trimmed confirmPassword='{}' (length={})",
                  trimmedPassword, (trimmedPassword != null ? trimmedPassword.length() : "null"),
                  trimmedConfirmPassword, (trimmedConfirmPassword != null ? trimmedConfirmPassword.length() : "null"));

        if (trimmedPassword == null || trimmedConfirmPassword == null || !trimmedPassword.equals(trimmedConfirmPassword)) {
             log.error("Password mismatch detected: Trimmed password and trimmed confirmPassword are not equal.");
            throw new RegistrationException("Podane hasła nie są identyczne.");
        }

        // Use the trimmed password for validation and encoding
        // String trimmedPassword = password.trim(); // Already defined above

        // 1. Validate Password Complexity
        if (!validationUtil.isPasswordValid(trimmedPassword)) {
            throw new RegistrationException("Hasło musi zawierać minimum 6 znaków, przynajmniej jedną dużą literę i jeden znak specjalny.");
        }

        // 2. Validate Email Format
        if (!validationUtil.isEmailValid(registerEmployeeDto.getEmail())) {
            throw new RegistrationException("Podany adres email jest nieprawidłowy.");
        }

        // 3. Check if user already exists
        if (employeeRepository.findByLogin(registerEmployeeDto.getUserName()) != null) {
            throw new RegistrationException("Użytkownik o podanym loginie już istnieje.");
        }

        // 4. Check if email already exists
        if (employeeRepository.findByEmail(registerEmployeeDto.getEmail()) != null) {
            throw new RegistrationException("Podany adres email jest już zarejestrowany.");
        }

        // 5. Create new Employee (without saving yet, to get ID first if needed or save later)
        Employee newEmployee = new Employee();
        newEmployee.setUserName(registerEmployeeDto.getUserName());
        // Encode the trimmed password
        newEmployee.setPassword(passwordEncoder.encode(trimmedPassword));
        newEmployee.setFirstName(registerEmployeeDto.getFirstName());
        newEmployee.setLastName(registerEmployeeDto.getLastName());
        newEmployee.setEmail(registerEmployeeDto.getEmail());
        // Save employee first to get the ID
        Employee savedEmployee = employeeRepository.save(newEmployee);

        // 6. Create and save Address
        Address newAddress = new Address();
        newAddress.setEmployeeId(savedEmployee.getId()); // Set the employee ID
        newAddress.setStreet(registerEmployeeDto.getStreet());
        newAddress.setBuildingNumber(registerEmployeeDto.getBuildingNumber());
        newAddress.setApartmentNumber(registerEmployeeDto.getApartmentNumber());
        newAddress.setPostalCode(registerEmployeeDto.getPostalCode());
        newAddress.setCity(registerEmployeeDto.getCity());
        newAddress.setVoivodeship(registerEmployeeDto.getVoivodeship());
        newAddress.setDistrict(registerEmployeeDto.getDistrict());
        newAddress.setCommune(registerEmployeeDto.getCommune());
        newAddress.setPhoneNumber(registerEmployeeDto.getPhoneNumber());
        Address savedAddress = addressRepository.save(newAddress);

        // 7. Create and save EmployeeConsent
        EmployeeConsent newConsent = new EmployeeConsent();
        newConsent.setEmployeeId(savedEmployee.getId()); // Set the employee ID
        newConsent.setRodoConsent(registerEmployeeDto.getRodoConsent() != null && registerEmployeeDto.getRodoConsent());
        newConsent.setTermsConsent(registerEmployeeDto.getTermsConsent() != null && registerEmployeeDto.getTermsConsent());
        newConsent.setMarketingConsent(registerEmployeeDto.getMarketingConsent() != null && registerEmployeeDto.getMarketingConsent());
        newConsent.setConsentDate(Timestamp.from(Instant.now()));
        EmployeeConsent savedConsent = consentRepository.save(newConsent);

        // 8. Link Address and Consent back to Employee and save again
        savedEmployee.setPrimaryAddress(savedAddress);
        savedEmployee.setConsent(savedConsent);
        employeeRepository.save(savedEmployee); // Update employee with references

        // 9. Generate token
        return userAuthProvider.createToken(savedEmployee.getUserName());
    }

    public Map<String, Object> validateTokenAndGetRoles(String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            Authentication auth = userAuthProvider.validateToken(token);
            if (auth.getPrincipal() instanceof Employee) {
                Employee employee = (Employee) auth.getPrincipal();
                result.put("tokenValidity", true);
                List<String> roleNames = Optional.ofNullable(employee.getRoles())
                                               .orElse(Collections.emptyList())
                                               .stream()
                                               .map(Role::getName)
                                               .collect(Collectors.toList());
                result.put("roles", roleNames);
            } else {
                result.put("tokenValidity", false);
                result.put("roles", Collections.emptyList());
            }
        } catch (Exception e) {
            result.put("tokenValidity", false);
            result.put("roles", Collections.emptyList());
        }
        return result;
    }
}

