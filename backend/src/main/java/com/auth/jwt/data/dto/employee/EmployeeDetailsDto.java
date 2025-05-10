package com.auth.jwt.data.dto.employee;

import com.auth.jwt.data.dto.address.AddressDto; // Import AddressDto

public class EmployeeDetailsDto {

    private String firstName;
    private String lastName;
    private String email;
    private AddressDto primaryAddress; // Changed to AddressDto
    private AddressDto alternativeAddress; // Changed to AddressDto

    // Constructors
    public EmployeeDetailsDto() {
    }

    public EmployeeDetailsDto(String firstName, String lastName, String email, AddressDto primaryAddress, AddressDto alternativeAddress) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.primaryAddress = primaryAddress;
        this.alternativeAddress = alternativeAddress;
    }

    // Getters and Setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public AddressDto getPrimaryAddress() {
        return primaryAddress;
    }

    public void setPrimaryAddress(AddressDto primaryAddress) {
        this.primaryAddress = primaryAddress;
    }

    public AddressDto getAlternativeAddress() {
        return alternativeAddress;
    }

    public void setAlternativeAddress(AddressDto alternativeAddress) {
        this.alternativeAddress = alternativeAddress;
    }
}

