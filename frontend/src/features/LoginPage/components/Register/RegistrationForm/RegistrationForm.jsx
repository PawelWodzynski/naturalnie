import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';
import UserDataSection from './components/UserDataSection'; // Import UserDataSection
import AddressSection from './components/AddressSection';   // Import AddressSection
import ConsentSection from './components/ConsentSection';   // Import ConsentSection

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
  const [currentStep, setCurrentStep] = useState(1); // 1: UserData, 2: Address, 3: Consents
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => {
    // Add validation for current step if needed before proceeding
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Final validation before submitting
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne.');
      setCurrentStep(1); // Go back to user data step
      return;
    }
    if (!formData.rodoConsent || !formData.termsConsent) {
      setError('Zgody RODO i regulaminu są wymagane.');
      setCurrentStep(3); // Stay on consent step
      return;
    }

    try {
      // Prepare data for backend - include all fields
      const dataToSend = { ...formData }; // Send the whole state

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Rejestracja nie powiodła się (status: ${response.status})`
        );
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

      {/* Render current step */} 
      {currentStep === 1 && (
        <UserDataSection formData={formData} handleChange={handleChange} />
      )}
      {currentStep === 2 && (
        <AddressSection formData={formData} handleChange={handleChange} />
      )}
      {currentStep === 3 && (
        <ConsentSection formData={formData} handleChange={handleChange} />
      )}

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        {currentStep > 1 && (
          <button type="button" onClick={prevStep} className={styles.prevButton}>
            Wstecz
          </button>
        )}
        {currentStep < 3 && (
          <button type="button" onClick={nextStep} className={styles.nextButton}>
            Dalej
          </button>
        )}
        {currentStep === 3 && (
          <button type="submit" className={styles.submitButton}>
            Zarejestruj
          </button>
        )}
      </div>
    </form>
  );
};

export default RegistrationForm;

