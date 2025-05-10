package com.auth.jwt.data.dto.employee;

import com.auth.jwt.data.entity.auth.employee.Address;
import com.auth.jwt.data.entity.auth.employee.AlternativeAddress;

public class EmployeeDetailsDto {

    private String firstName;
    private String lastName;
    private String email;
    private Address primaryAddress;
    private AlternativeAddress alternativeAddress;

    // Constructors
    public EmployeeDetailsDto() {
    }

    public EmployeeDetailsDto(String firstName, String lastName, String email, Address primaryAddress, AlternativeAddress alternativeAddress) {
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

    public Address getPrimaryAddress() {
        return primaryAddress;
    }

    public void setPrimaryAddress(Address primaryAddress) {
        this.primaryAddress = primaryAddress;
    }

    public AlternativeAddress getAlternativeAddress() {
        return alternativeAddress;
    }

    public void setAlternativeAddress(AlternativeAddress alternativeAddress) {
        this.alternativeAddress = alternativeAddress;
    }
}

