import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';
import UserDataSection from './components/UserDataSection';
import AddressSection from './components/AddressSection';
import ConsentSection from './components/ConsentSection';
import AlternativeAddressSection from './components/AlternativeAddressSection';

const RegistrationForm = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAlternativeAddress, setShowAlternativeAddress] = useState(false);
  const [isCompanyAddress, setIsCompanyAddress] = useState(false); // State for primary address company radio
  const [isAltCompanyAddress, setIsAltCompanyAddress] = useState(false); // State for alternative address company radio
  const [formData, setFormData] = useState({
    // Employee details
    userName: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    // Primary Address details
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
    postalCode: '',
    city: '',
    voivodeship: '',
    district: '',
    commune: '',
    phoneNumber: '',
    nip: '',
    companyName: '',
    // Alternative Address details
    altStreet: '',
    altBuildingNumber: '',
    altApartmentNumber: '',
    altPostalCode: '',
    altCity: '',
    altVoivodeship: '',
    altDistrict: '',
    altCommune: '',
    altPhoneNumber: '',
    altNip: '',
    altCompanyName: '',
    // Consent details
    rodoConsent: false,
    termsConsent: false,
    marketingConsent: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'showAlternativeAddressCheckbox') {
      setShowAlternativeAddress(checked);
    } else if (name === 'isCompanyAddressRadio') {
      setIsCompanyAddress(checked);
      // Clear NIP/Company Name if unchecked
      if (!checked) {
        setFormData((prevData) => ({
          ...prevData,
          nip: '',
          companyName: '',
        }));
      }
    } else if (name === 'isAltCompanyAddressRadio') {
      setIsAltCompanyAddress(checked);
      // Clear Alt NIP/Company Name if unchecked
      if (!checked) {
        setFormData((prevData) => ({
          ...prevData,
          altNip: '',
          altCompanyName: '',
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const nextStep = () => {
    setError(''); // Clear previous errors before validation

    // Validation for Step 1
    if (currentStep === 1) {
      if (!formData.userName || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.email) {
        setError('Proszę wypełnić wszystkie pola danych podstawowych.');
        return;
      }
      if (formData.password.trim() !== formData.confirmPassword.trim()) {
        setError('Hasła nie są identyczne.');
        return;
      }
    }

    // Validation for Step 2 (Address)
    if (currentStep === 2) {
      // Basic required fields for primary address
      if (!formData.street || !formData.buildingNumber || !formData.postalCode || !formData.city || !formData.phoneNumber) {
        setError('Proszę wypełnić wymagane pola adresu podstawowego (ulica, nr budynku, kod pocztowy, miasto, telefon).');
        return;
      }

      // NIP and Company Name validation for primary address (only if company radio is checked)
      if (isCompanyAddress) {
        if (!formData.nip) {
          setError('Proszę podać NIP dla adresu podstawowego.');
          return;
        }
        if (!/^\d{10}$/.test(formData.nip)) {
          setError('Błędnie wpisany numer NIP w adresie podstawowym, wymagane 10 cyfr.');
          return;
        }
        if (!formData.companyName) {
          setError('Nazwa firmy w adresie podstawowym musi być uzupełniona, jeśli zaznaczono opcję firma.');
          return;
        }
      }

      // Validation for alternative address if shown
      if (showAlternativeAddress) {
        // Basic required fields for alternative address
        if (!formData.altStreet || !formData.altBuildingNumber || !formData.altPostalCode || !formData.altCity || !formData.altPhoneNumber) {
          setError('Proszę wypełnić wymagane pola adresu alternatywnego (ulica, nr budynku, kod pocztowy, miasto, telefon).');
          return;
        }

        // NIP and Company Name validation for alternative address (only if alt company radio is checked)
        if (isAltCompanyAddress) {
          if (!formData.altNip) {
            setError('Proszę podać NIP dla adresu alternatywnego.');
            return;
          }
          if (!/^\d{10}$/.test(formData.altNip)) {
            setError('Błędnie wpisany numer NIP w adresie alternatywnym, wymagane 10 cyfr.');
            return;
          }
          if (!formData.altCompanyName) {
            setError('Nazwa firmy w adresie alternatywnym musi być uzupełniona, jeśli zaznaczono opcję firma.');
            return;
          }
        }
      }
    }

    // If validation passes, proceed to the next step
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

    // NIP/Company Name validation is already done in step 2 validation

    try {
      const dataToSend = formData;

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

      <div className={styles.formSectionContainer}>
        {currentStep === 1 && <UserDataSection formData={formData} handleChange={handleChange} />}
        {currentStep === 2 && (
          <>
            <AddressSection
              formData={formData}
              handleChange={handleChange}
              isCompanyAddress={isCompanyAddress} // Pass state
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="showAlternativeAddressCheckbox"
                name="showAlternativeAddressCheckbox"
                checked={showAlternativeAddress}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <label htmlFor="showAlternativeAddressCheckbox" className={styles.checkboxLabel}>
                Dodaj alternatywny adres dostawy
              </label>
            </div>
            {showAlternativeAddress && (
              <AlternativeAddressSection
                formData={formData}
                handleChange={handleChange}
                isAltCompanyAddress={isAltCompanyAddress} // Pass state
              />
            )}
          </>
        )}
        {currentStep === 3 && <ConsentSection formData={formData} handleChange={handleChange} />}
      </div>

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

