import React, { useState, useCallback } from 'react';
import styles from './DropdownField.module.css';

const DropdownField = ({ label, name, value, onChange, fetchDataFunction, optionValueKey, optionLabelKey, required }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const loadOptions = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous fetches
    setLoading(true);
    setError(null);
    setHasAttemptedFetch(true);
    try {
      const data = await fetchDataFunction();
      // Assuming data is an array of objects. If not, it might need transformation here or in apiService.
      if (Array.isArray(data)) {
        setOptions(data);
        if (data.length > 0) {
          // For debugging: Log the structure of the first item to verify keys
          // console.log(`DropdownField (${name}) - First option data:`, JSON.stringify(data[0]));
        }
      } else {
        console.warn(`DropdownField (${name}): fetchDataFunction did not return an array. Received:`, data);
        setOptions([]);
        setError(`Nieprawidłowy format danych dla ${label}.`);
      }
    } catch (err) {
      console.error(`Error fetching data for ${name} (${label}):`, err);
      setError(`Nie udało się załadować danych dla pola ${label}.`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchDataFunction, name, label, loading]);

  const handleFocus = () => {
    // Fetch options only if they haven't been fetched yet or to refresh them.
    // Current implementation fetches every time on focus.
    // If data should be fetched only once, add a condition like !hasAttemptedFetch || options.length === 0
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
    onChange(e, selectedOption); // Pass the original event and the full selected option object
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{label}:</label>
      <select
        id={name}
        name={name}
        value={value} // This should be the ID (or whatever optionValueKey represents)
        onChange={handleChange}
        onFocus={handleFocus}
        className={styles.formInput}
        required={required}
      >
        <option value="">Wybierz...</option>
        {loading && <option value="" disabled>Ładowanie...</option>}
        {!loading && Array.isArray(options) && options.map((option, index) => {
          if (typeof option !== 'object' || option === null) {
            return <option key={`invalid-option-${index}`} value="" disabled>Nieprawidłowa opcja</option>;
          }

          const optVal = option[optionValueKey];
          let optLabel = option[optionLabelKey];

          if (optVal === undefined || optVal === null) {
            // Skip options that don't have a valid value key
            return null; 
          }

          if (optLabel === undefined || optLabel === null) {
            optLabel = `[ID: ${optVal}]`; // Fallback label if the primary label key is missing
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
        <p className={styles.infoMessage}>Brak dostępnych opcji.</p>
      )}
    </div>
  );
};

export default DropdownField;

