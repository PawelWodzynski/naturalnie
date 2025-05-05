import React, { useState } from 'react';
import styles from './RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

    try {
      // Prepare data for backend
      const dataToSend = {
        userName: formData.userName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      // Użyj fetch zamiast axios, z pełnym URL
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      // Sprawdź status odpowiedzi
      if (!response.ok) {
        // Spróbuj odczytać szczegóły błędu jeśli serwer je zwrócił
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Rejestracja nie powiodła się (status: ${response.status})`
        );
      }

      // Przekształć odpowiedź na JSON
      const data = await response.json();
      console.log('Registration response:', data);

      // Zapisz token w localStorage
      const { token } = data;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Registration successful, token stored.');
      }

      // Przekieruj do panelu po udanej rejestracji
      navigate('/dashboard');
      if (onSuccess) {
        onSuccess(); // Zamknij modal jeśli przekazano callbacka onSuccess
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
      <div className={styles.formGroup}>
        <label htmlFor="userName">Username</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>Register</button>
    </form>
  );
};

export default RegistrationForm;