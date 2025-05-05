package com.auth.jwt.data.dto.employee;

import lombok.Data;

@Data
public class RegisterEmployeeDto {
    private String userName;
    private String password;
    private String confirmPassword; // Added confirm password field
    private String firstName;
    private String lastName;
    private String email;
}

