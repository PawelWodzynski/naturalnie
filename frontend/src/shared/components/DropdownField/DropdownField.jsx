import React, { useState, useCallback } from 'react';
import styles from './DropdownField.module.css';

const DropdownField = ({ label, name, value, onChange, fetchDataFunction, optionValueKey, optionLabelKey, required }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const loadOptions = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setHasAttemptedFetch(true);
    try {
      const dataFromService = await fetchDataFunction();
      // console.log(`DropdownField (${label}) - Data received from service:`, JSON.stringify(dataFromService)); // For debugging

      if (Array.isArray(dataFromService)) {
        setOptions(dataFromService);
      } else {
        console.warn(`DropdownField (${label}): fetchDataFunction did not return an array. Received:`, dataFromService);
        setOptions([]);
        // Provide a more specific error message if dataFromService is not an array
        setError(`Nieprawidłowy format danych dla ${label}. Oczekiwano tablicy, otrzymano: ${typeof dataFromService}`);
      }
    } catch (err) {
      // This catches errors thrown by apiService.js (e.g., network error, API error response)
      console.error(`Error fetching data for ${label} in DropdownField catch:`, err);
      setError(err.message || `Nie udało się załadować danych dla pola ${label}.`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchDataFunction, name, label, loading]); // Added name to dependencies as it's used in console logs

  const handleFocus = () => {
    loadOptions();
  };

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = Array.isArray(options) ? options.find(option => {
        if (typeof option === 'object' && option !== null && option.hasOwnProperty(optionValueKey)) {
            return String(option[optionValueKey]) === selectedValue;
        }
        return false;
    }) || null : null;
    onChange(e, selectedOption);
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{label}:</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        className={styles.formInput}
        required={required}
      >
        <option value="">Wybierz...</option>
        {loading && <option value="" disabled>Ładowanie...</option>}
        {!loading && !error && Array.isArray(options) && options.map((option, index) => {
          if (typeof option !== 'object' || option === null) {
            console.warn(`DropdownField (${label}): Invalid option item at index ${index}:`, option);
            return <option key={`invalid-option-${index}-${name}`} value="" disabled>Nieprawidłowa opcja</option>;
          }

          const optVal = option[optionValueKey];
          let optLabel = option[optionLabelKey];

          if (optVal === undefined || optVal === null) {
            console.warn(`DropdownField (${label}): Option at index ${index} missing value for key '${optionValueKey}':`, option);
            return null; 
          }

          if (optLabel === undefined || optLabel === null) {
            // Fallback label, but ideally optionLabelKey should always exist if data is correct
            optLabel = `[ID: ${optVal}]`; 
            console.warn(`DropdownField (${label}): Option at index ${index} (ID: ${optVal}) missing label for key '${optionLabelKey}'. Using fallback.`);
          }

          return (
            <option key={optVal} value={optVal}>
              {String(optLabel)}
            </option>
          );
        })}
      </select>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && hasAttemptedFetch && Array.isArray(options) && options.length === 0 && (
        <p className={styles.infoMessage}>Brak dostępnych opcji dla pola {label}.</p>
      )}
    </div>
  );
};

export default DropdownField;

