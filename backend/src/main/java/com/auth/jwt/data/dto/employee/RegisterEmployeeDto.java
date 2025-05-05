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

    // Primary Address details
    private String street;
    private String buildingNumber;
    private String apartmentNumber; // Optional
    private String postalCode;
    private String city;
    private String voivodeship; // Optional
    private String district; // Optional
    private String commune; // Optional
    private String phoneNumber; // Optional
    private String nip; // Added NIP for primary address
    private String companyName; // Added Company Name for primary address

    // Alternative Address details (Optional)
    private String altStreet;
    private String altBuildingNumber;
    private String altApartmentNumber;
    private String altPostalCode;
    private String altCity;
    private String altVoivodeship;
    private String altDistrict;
    private String altCommune;
    private String altPhoneNumber;
    private String altNip; // Added NIP for alternative address
    private String altCompanyName; // Added Company Name for alternative address

    // Consent details
    private Boolean rodoConsent;
    private Boolean termsConsent;
    private Boolean marketingConsent;
}

