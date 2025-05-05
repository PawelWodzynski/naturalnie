import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    // Employee details
    userName: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    // Address details
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
    postalCode: '',
    city: '',
    voivodeship: '',
    district: '',
    commune: '',
    phoneNumber: '',
    // Consent details
    rodoConsent: false,
    termsConsent: false,
    marketingConsent: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Frontend validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne.');
      return; // Stop submission if passwords don't match
    }
    
    // Frontend validation: Check if required consents are checked
    if (!formData.rodoConsent || !formData.termsConsent) {
        setError('Zgody RODO i regulaminu są wymagane.');
        return; // Stop submission if required consents are not checked
    }

    try {
      // Prepare data for backend - include all fields
      const dataToSend = {
        userName: formData.userName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        street: formData.street,
        buildingNumber: formData.buildingNumber,
        apartmentNumber: formData.apartmentNumber,
        postalCode: formData.postalCode,
        city: formData.city,
        voivodeship: formData.voivodeship,
        district: formData.district,
        commune: formData.commune,
        phoneNumber: formData.phoneNumber,
        rodoConsent: formData.rodoConsent,
        termsConsent: formData.termsConsent,
        marketingConsent: formData.marketingConsent,
      };

      // Use fetch with the correct endpoint
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      // Check response status
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Rejestracja nie powiodła się (status: ${response.status})`
        );
      }

      // Process successful response
      const data = await response.json();
      console.log('Registration response:', data);

      // Store token
      const { token } = data;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Registration successful, token stored.');
      }

      // Redirect or close modal
      navigate('/dashboard');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.name === 'TypeError' && err.message.includes('NetworkError')) {
        setError('Błąd sieci. Sprawdź połączenie internetowe.');
      } else if (err.name === 'SyntaxError') {
        setError('Otrzymano nieprawidłową odpowiedź z serwera.');
      } else {
        setError(err.message || 'Rejestracja nie powiodła się. Spróbuj ponownie.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registrationForm}>
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      {/* Employee Details */}
      <fieldset className={styles.fieldset}>
        <legend>Dane Podstawowe</legend>
        <div className={styles.formGroup}>
          <label htmlFor="userName">Username</label>
          <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
      </fieldset>

      {/* Address Details */}
      <fieldset className={styles.fieldset}>
        <legend>Adres</legend>
        <div className={styles.formGroup}>
          <label htmlFor="street">Ulica</label>
          <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="buildingNumber">Numer budynku</label>
          <input type="text" id="buildingNumber" name="buildingNumber" value={formData.buildingNumber} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="apartmentNumber">Numer mieszkania (opcjonalnie)</label>
          <input type="text" id="apartmentNumber" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="postalCode">Kod pocztowy</label>
          <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required pattern="\d{2}-\d{3}" title="Format XX-XXX" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city">Miasto</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="voivodeship">Województwo (opcjonalnie)</label>
          <input type="text" id="voivodeship" name="voivodeship" value={formData.voivodeship} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="district">Powiat (opcjonalnie)</label>
          <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="commune">Gmina (opcjonalnie)</label>
          <input type="text" id="commune" name="commune" value={formData.commune} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Numer telefonu (opcjonalnie)</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>
      </fieldset>

      {/* Consent Details */}
      <fieldset className={styles.fieldset}>
        <legend>Zgody</legend>
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="rodoConsent" name="rodoConsent" checked={formData.rodoConsent} onChange={handleChange} />
          <label htmlFor="rodoConsent">Zgoda RODO (wymagana)</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="termsConsent" name="termsConsent" checked={formData.termsConsent} onChange={handleChange} />
          <label htmlFor="termsConsent">Akceptacja regulaminu (wymagana)</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input type="checkbox" id="marketingConsent" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} />
          <label htmlFor="marketingConsent">Zgoda marketingowa (opcjonalna)</label>
        </div>
      </fieldset>

      <button type="submit" className={styles.submitButton}>Register</button>
    </form>
  );
};

export default RegistrationForm;

