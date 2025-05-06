package com.auth.jwt.data.entity.auth.employee;

import jakarta.persistence.*;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "employee")
public class Employee {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment strategy
    @Column(name = "id") // Database column mapping
    private Long id;

    @Column(name = "username")
    private String userName;

    @Column(name = "password")
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "employee_roles", // Table for mapping roles
            joinColumns = @JoinColumn(name = "user_id"), // Owning side of the relationship
            inverseJoinColumns = @JoinColumn(name = "role_id")) // Inverse side of the relationship
    private List<Role> roles; // Collection to store roles

    // One-to-one relationship with EmployeeConsent - Changed to EAGER
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "consent_id", referencedColumnName = "consent_id") // Maps to the foreign key column in employees table
    private EmployeeConsent consent;

    // One-to-one relationship with Address (for primary address) - Changed to EAGER
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "primary_address_id", referencedColumnName = "address_id") // Maps to the foreign key column in employees table
    private Address primaryAddress;

    // One-to-one relationship with AlternativeAddress (optional) - Changed to EAGER
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, optional = true)
    @JoinColumn(name = "alternative_address_id", referencedColumnName = "address_id", nullable = true) // Maps to the foreign key column in employees table, nullable
    private AlternativeAddress alternativeAddress;

    // Default constructor
    public Employee() {
    }

    // Constructor with basic fields
    public Employee(String userName, String password, String firstName, String lastName, String email) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Constructor with roles
    public Employee(String userName, String password, String firstName, String lastName, String email,
                    List<Role> roles) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
    }

    // Constructor with all fields including new relationships
    public Employee(String userName, String password, String firstName, String lastName, String email,
                    List<Role> roles, EmployeeConsent consent, Address primaryAddress, AlternativeAddress alternativeAddress) {
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
        this.consent = consent;
        this.primaryAddress = primaryAddress;
        this.alternativeAddress = alternativeAddress; // Added alternativeAddress
    }

    // Getter and setter methods for all fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

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

    public Collection<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public EmployeeConsent getConsent() {
        return consent;
    }

    public void setConsent(EmployeeConsent consent) {
        this.consent = consent;
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

    // Adding toString method for debugging
    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", userName=\'" + userName + "\\\'" +
                ", password=\'" + "*********" + "\\\'" +
                ", firstName=\'" + firstName + "\\\'" +
                ", lastName=\'" + lastName + "\\\'" +
                ", email=\'" + email + "\\\'" +
                ", roles=" + (roles != null ? roles.size() + " roles" : "null") +
                ", consentId=" + (consent != null ? consent.getConsentId() : "null") +
                ", primaryAddressId=" + (primaryAddress != null ? primaryAddress.getAddressId() : "null") +
                ", alternativeAddressId=" + (alternativeAddress != null ? alternativeAddress.getAddressId() : "null") +
                '}';
    }
}

