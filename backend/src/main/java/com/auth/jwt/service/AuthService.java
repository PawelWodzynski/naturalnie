package com.auth.jwt.service;

import com.auth.jwt.data.dto.authorization.CredentialsDto;
import com.auth.jwt.data.dto.employee.RegisterEmployeeDto;
import com.auth.jwt.data.entity.auth.employee.Address;
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.data.entity.auth.employee.EmployeeConsent;
import com.auth.jwt.data.entity.auth.employee.Role;
import com.auth.jwt.data.repository.auth.employee.AddressRepository;
import com.auth.jwt.data.repository.auth.employee.EmployeeConsentRepository;
import com.auth.jwt.data.repository.auth.employee.EmployeeJpaRepository;
import com.auth.jwt.exception.RegistrationException;
import com.auth.jwt.exception.AuthenticationException;
import com.auth.jwt.security.UserAuthProvider;
import com.auth.jwt.util.ValidationUtil;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class AuthService {

    private final EmployeeJpaRepository employeeRepository;
    private final AddressRepository addressRepository;
    private final EmployeeConsentRepository consentRepository;
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

    @Transactional("authTransactionManager")
    public String register(RegisterEmployeeDto registerEmployeeDto) throws RegistrationException {
        // Completely bypass password validation for now to test if this is the issue
        // We'll still use the password for account creation
        
        // Get password from DTO
        String password = registerEmployeeDto.getPassword();
        
        // Log password details for debugging
        log.info("Registration attempt with password: [{}]", password);
        
        // 1. Validate Password Complexity
        if (!validationUtil.isPasswordValid(password)) {
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

        // 5. Create new Employee
        Employee newEmployee = new Employee();
        newEmployee.setUserName(registerEmployeeDto.getUserName());
        newEmployee.setPassword(passwordEncoder.encode(password));
        newEmployee.setFirstName(registerEmployeeDto.getFirstName());
        newEmployee.setLastName(registerEmployeeDto.getLastName());
        newEmployee.setEmail(registerEmployeeDto.getEmail());
        Employee savedEmployee = employeeRepository.save(newEmployee);

        // 6. Create and save Address
        Address newAddress = new Address();
        newAddress.setEmployeeId(savedEmployee.getId());
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
        newConsent.setEmployeeId(savedEmployee.getId());
        newConsent.setRodoConsent(registerEmployeeDto.getRodoConsent() != null && registerEmployeeDto.getRodoConsent());
        newConsent.setTermsConsent(registerEmployeeDto.getTermsConsent() != null && registerEmployeeDto.getTermsConsent());
        newConsent.setMarketingConsent(registerEmployeeDto.getMarketingConsent() != null && registerEmployeeDto.getMarketingConsent());
        newConsent.setConsentDate(Timestamp.from(Instant.now()));
        EmployeeConsent savedConsent = consentRepository.save(newConsent);

        // 8. Link Address and Consent back to Employee and save again
        savedEmployee.setPrimaryAddress(savedAddress);
        savedEmployee.setConsent(savedConsent);
        employeeRepository.save(savedEmployee);

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
