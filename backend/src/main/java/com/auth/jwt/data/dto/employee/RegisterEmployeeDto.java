package com.auth.jwt.data.dto.employee;

import lombok.Data;

@Data
public class RegisterEmployeeDto {
    // Employee details
    private String userName;
    private String password;
    private String confirmPassword;
    private String firstName;
    private String lastName;
    private String email;

    // Address details
    private String street;
    private String buildingNumber;
    private String apartmentNumber; // Optional
    private String postalCode;
    private String city;
    private String voivodeship; // Optional
    private String district; // Optional
    private String commune; // Optional
    private String phoneNumber; // Optional

    // Consent details
    private Boolean rodoConsent;
    private Boolean termsConsent;
    private Boolean marketingConsent;
}

