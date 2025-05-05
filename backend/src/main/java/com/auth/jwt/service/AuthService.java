package com.auth.jwt.service;

import com.auth.jwt.data.dto.authorization.CredentialsDto;
import com.auth.jwt.data.dto.employee.RegisterEmployeeDto;
import com.auth.jwt.data.entity.auth.employee.Address;
import com.auth.jwt.data.entity.auth.employee.AlternativeAddress; // Import AlternativeAddress
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.data.entity.auth.employee.EmployeeConsent;
import com.auth.jwt.data.entity.auth.employee.Role;
import com.auth.jwt.data.repository.auth.employee.AddressRepository;
import com.auth.jwt.data.repository.auth.employee.AlternativeAddressRepository; // Import AlternativeAddressRepository
import com.auth.jwt.data.repository.auth.employee.EmployeeConsentRepository;
import com.auth.jwt.data.repository.auth.employee.EmployeeJpaRepository;
import com.auth.jwt.exception.RegistrationException;
import com.auth.jwt.exception.AuthenticationException;
import com.auth.jwt.security.UserAuthProvider;
import com.auth.jwt.util.ValidationUtil;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; // Import StringUtils

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
    private final AlternativeAddressRepository alternativeAddressRepository; // Inject AlternativeAddressRepository
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
        // 0. Check if passwords match (trimming whitespace)
        String password = registerEmployeeDto.getPassword();
        String confirmPassword = registerEmployeeDto.getConfirmPassword();

        // Add Debug Logging
        log.debug("Password validation: Raw password=\\'{}}\\' (length={}), Raw confirmPassword=\\'{}}\\' (length={})", 
                  password, (password != null ? password.length() : "null"), 
                  confirmPassword, (confirmPassword != null ? confirmPassword.length() : "null"));
        
        String trimmedPassword = (password != null) ? password.trim() : null;
        String trimmedConfirmPassword = (confirmPassword != null) ? confirmPassword.trim() : null;

        log.debug("Password validation: Trimmed password=\\'{}}\\' (length={}), Trimmed confirmPassword=\\'{}}\\' (length={})",
                  trimmedPassword, (trimmedPassword != null ? trimmedPassword.length() : "null"),
                  trimmedConfirmPassword, (trimmedConfirmPassword != null ? trimmedConfirmPassword.length() : "null"));

        // Restore password validation
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

        // 5. Create new Employee
        Employee newEmployee = new Employee();
        newEmployee.setUserName(registerEmployeeDto.getUserName());
        newEmployee.setPassword(passwordEncoder.encode(trimmedPassword));
        newEmployee.setFirstName(registerEmployeeDto.getFirstName());
        newEmployee.setLastName(registerEmployeeDto.getLastName());
        newEmployee.setEmail(registerEmployeeDto.getEmail());
        // Don't save employee yet, need to link addresses first

        // 6. Create Primary Address
        Address newAddress = new Address();
        // Set employeeId after saving employee
        newAddress.setStreet(registerEmployeeDto.getStreet());
        newAddress.setBuildingNumber(registerEmployeeDto.getBuildingNumber());
        newAddress.setApartmentNumber(registerEmployeeDto.getApartmentNumber());
        newAddress.setPostalCode(registerEmployeeDto.getPostalCode());
        newAddress.setCity(registerEmployeeDto.getCity());
        newAddress.setVoivodeship(registerEmployeeDto.getVoivodeship());
        newAddress.setDistrict(registerEmployeeDto.getDistrict());
        newAddress.setCommune(registerEmployeeDto.getCommune());
        newAddress.setPhoneNumber(registerEmployeeDto.getPhoneNumber());
        newAddress.setNip(registerEmployeeDto.getNip()); // Set NIP
        newAddress.setCompanyName(registerEmployeeDto.getCompanyName()); // Set Company Name
        // Don't save address yet

        // 7. Create Alternative Address if any alt field is present
        AlternativeAddress newAlternativeAddress = null;
        // Check if *any* alternative address field (including NIP/Company Name) has text
        if (StringUtils.hasText(registerEmployeeDto.getAltStreet()) ||
            StringUtils.hasText(registerEmployeeDto.getAltBuildingNumber()) ||
            StringUtils.hasText(registerEmployeeDto.getAltApartmentNumber()) ||
            StringUtils.hasText(registerEmployeeDto.getAltPostalCode()) ||
            StringUtils.hasText(registerEmployeeDto.getAltCity()) ||
            StringUtils.hasText(registerEmployeeDto.getAltVoivodeship()) ||
            StringUtils.hasText(registerEmployeeDto.getAltDistrict()) ||
            StringUtils.hasText(registerEmployeeDto.getAltCommune()) ||
            StringUtils.hasText(registerEmployeeDto.getAltPhoneNumber()) ||
            StringUtils.hasText(registerEmployeeDto.getAltNip()) || // Check Alt NIP
            StringUtils.hasText(registerEmployeeDto.getAltCompanyName())) // Check Alt Company Name
        {
            log.info("Alternative address data found, creating AlternativeAddress entity.");
            newAlternativeAddress = new AlternativeAddress();
            newAlternativeAddress.setStreet(registerEmployeeDto.getAltStreet());
            newAlternativeAddress.setBuildingNumber(registerEmployeeDto.getAltBuildingNumber());
            newAlternativeAddress.setApartmentNumber(registerEmployeeDto.getAltApartmentNumber());
            newAlternativeAddress.setPostalCode(registerEmployeeDto.getAltPostalCode());
            newAlternativeAddress.setCity(registerEmployeeDto.getAltCity());
            newAlternativeAddress.setVoivodeship(registerEmployeeDto.getAltVoivodeship());
            newAlternativeAddress.setDistrict(registerEmployeeDto.getAltDistrict());
            newAlternativeAddress.setCommune(registerEmployeeDto.getAltCommune());
            newAlternativeAddress.setPhoneNumber(registerEmployeeDto.getAltPhoneNumber());
            newAlternativeAddress.setNip(registerEmployeeDto.getAltNip()); // Set Alt NIP
            newAlternativeAddress.setCompanyName(registerEmployeeDto.getAltCompanyName()); // Set Alt Company Name
            // Save alternative address first to get ID
            newAlternativeAddress = alternativeAddressRepository.save(newAlternativeAddress);
            newEmployee.setAlternativeAddress(newAlternativeAddress); // Link to employee
        } else {
            log.info("No alternative address data provided.");
        }

        // 8. Create EmployeeConsent
        EmployeeConsent newConsent = new EmployeeConsent();
        // Set employeeId after saving employee
        newConsent.setRodoConsent(registerEmployeeDto.getRodoConsent() != null && registerEmployeeDto.getRodoConsent());
        newConsent.setTermsConsent(registerEmployeeDto.getTermsConsent() != null && registerEmployeeDto.getTermsConsent());
        newConsent.setMarketingConsent(registerEmployeeDto.getMarketingConsent() != null && registerEmployeeDto.getMarketingConsent());
        newConsent.setConsentDate(Timestamp.from(Instant.now()));
        // Don't save consent yet

        // 9. Save Employee first to get ID
        Employee savedEmployee = employeeRepository.save(newEmployee);
        Long employeeId = savedEmployee.getId();

        // 10. Set employeeId and save Address and Consent
        newAddress.setEmployeeId(employeeId);
        Address savedAddress = addressRepository.save(newAddress);
        
        newConsent.setEmployeeId(employeeId);
        EmployeeConsent savedConsent = consentRepository.save(newConsent);

        // 11. Link saved Address and Consent back to Employee and save again
        savedEmployee.setPrimaryAddress(savedAddress);
        savedEmployee.setConsent(savedConsent);
        // Alternative address is already linked if created
        employeeRepository.save(savedEmployee); // Final update

        // 12. Generate token
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

