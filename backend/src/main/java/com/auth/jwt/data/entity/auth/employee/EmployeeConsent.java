package com.auth.jwt.data.entity.auth.employee;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "employee_consents")
public class EmployeeConsent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consent_id")
    private Integer consentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, insertable = false, updatable = false)
    @JsonBackReference // Added to break serialization loop
    private Employee employee;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "rodo_consent", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean rodoConsent = false;

    @Column(name = "terms_consent", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean termsConsent = false;

    @Column(name = "marketing_consent", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean marketingConsent = false;

    @Column(name = "consent_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp consentDate;

    // Getters and Setters

    public Integer getConsentId() {
        return consentId;
    }

    public void setConsentId(Integer consentId) {
        this.consentId = consentId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Boolean getRodoConsent() {
        return rodoConsent;
    }

    public void setRodoConsent(Boolean rodoConsent) {
        this.rodoConsent = rodoConsent;
    }

    public Boolean getTermsConsent() {
        return termsConsent;
    }

    public void setTermsConsent(Boolean termsConsent) {
        this.termsConsent = termsConsent;
    }

    public Boolean getMarketingConsent() {
        return marketingConsent;
    }

    public void setMarketingConsent(Boolean marketingConsent) {
        this.marketingConsent = marketingConsent;
    }

    public Timestamp getConsentDate() {
        return consentDate;
    }

    public void setConsentDate(Timestamp consentDate) {
        this.consentDate = consentDate;
    }
}

