package com.auth.jwt.service;

import com.auth.jwt.data.dto.authorization.CredentialsDto;
import com.auth.jwt.data.dto.employee.RegisterEmployeeDto;
import com.auth.jwt.data.entity.auth.employee.Employee;
import com.auth.jwt.data.entity.auth.employee.Role;
import com.auth.jwt.data.repository.auth.employee.EmployeeJpaRepository;
import com.auth.jwt.exception.RegistrationException;
import com.auth.jwt.exception.AuthenticationException;
import com.auth.jwt.security.UserAuthProvider;
import com.auth.jwt.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmployeeJpaRepository employeeRepository;
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

    public String register(RegisterEmployeeDto registerEmployeeDto) throws RegistrationException {
        // 0. Check if passwords match
        if (registerEmployeeDto.getPassword() == null || !registerEmployeeDto.getPassword().equals(registerEmployeeDto.getConfirmPassword())) {
            throw new RegistrationException("Podane hasła nie są identyczne.");
        }

        // 1. Validate Password Complexity
        if (!validationUtil.isPasswordValid(registerEmployeeDto.getPassword())) {
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

        // 5. Create and save new user
        Employee newEmployee = new Employee();
        newEmployee.setUserName(registerEmployeeDto.getUserName());
        newEmployee.setPassword(passwordEncoder.encode(registerEmployeeDto.getPassword())); // Use the validated password
        newEmployee.setFirstName(registerEmployeeDto.getFirstName());
        newEmployee.setLastName(registerEmployeeDto.getLastName());
        newEmployee.setEmail(registerEmployeeDto.getEmail());
        employeeRepository.save(newEmployee);

        // 6. Generate token
        return userAuthProvider.createToken(newEmployee.getUserName());
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

