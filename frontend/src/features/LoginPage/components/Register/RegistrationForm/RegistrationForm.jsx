import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';
import UserDataSection from './components/UserDataSection';
import AddressSection from './components/AddressSection';
import ConsentSection from './components/ConsentSection';

const RegistrationForm = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const nextStep = () => {
    // Add validation for the current step before proceeding
    if (currentStep === 1) {
      if (!formData.userName || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.email) {
        setError('Proszę wypełnić wszystkie pola danych podstawowych.');
        return;
      }
      // Trim whitespace before comparing passwords
      if (formData.password.trim() !== formData.confirmPassword.trim()) {
        setError('Hasła nie są identyczne.');
        return;
      }
    }
    if (currentStep === 2) {
       // Basic check, more specific validation might be needed
      if (!formData.street || !formData.buildingNumber || !formData.postalCode || !formData.city || !formData.phoneNumber) {
        setError('Proszę wypełnić wymagane pola adresowe (ulica, nr budynku, kod pocztowy, miasto, telefon).');
        return;
      }
    }
    setError(''); // Clear error if validation passes
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError(''); // Clear error when going back
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Final validation before submitting (Consent step)
    if (!formData.rodoConsent || !formData.termsConsent) {
      setError('Zgody RODO i regulaminu są wymagane.');
      return;
    }

    // Also check password match on final submit, just in case?
    // It's better to rely on the step validation, but adding it here won't hurt.
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
        setError('Hasła nie są identyczne. Proszę wrócić do kroku 1 i poprawić.');
        return;
    }

    try {
      // IMPORTANT: Send the entire formData including confirmPassword to backend
      const dataToSend = formData; // Send complete form data including confirmPassword

      // Remove console logs showing sensitive data
      // console.log('Data being sent to backend:', dataToSend);
      // console.log('Password being sent:', dataToSend.password);
      // console.log('ConfirmPassword being sent:', dataToSend.confirmPassword);

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Rejestracja nie powiodła się (status: ${response.status})` }));
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log('Registration response:', data);

      const { token } = data;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Registration successful, token stored.');
      }

      navigate('/dashboard');
      if (onSuccess) {
        onSuccess(); // Close modal or perform other success actions
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Rejestracja nie powiodła się. Spróbuj ponownie.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registrationForm}>
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Render the current step's section */}
      <div className={styles.formSectionContainer}>
        {currentStep === 1 && <UserDataSection formData={formData} handleChange={handleChange} />}
        {currentStep === 2 && <AddressSection formData={formData} handleChange={handleChange} />}
        {currentStep === 3 && <ConsentSection formData={formData} handleChange={handleChange} />}
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        {currentStep > 1 && (
          <button type="button" onClick={prevStep} className={`${styles.navButton} ${styles.prevButton}`}>
            Wstecz
          </button>
        )}
        {currentStep < 3 && (
          <button type="button" onClick={nextStep} className={`${styles.navButton} ${styles.nextButton}`}>
            Dalej
          </button>
        )}
        {currentStep === 3 && (
          <button type="submit" className={`${styles.navButton} ${styles.submitButton}`}>
            Zarejestruj
          </button>
        )}
      </div>
    </form>
  );
};

export default RegistrationForm;
