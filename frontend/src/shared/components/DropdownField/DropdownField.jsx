import React, { useState, useCallback } from 'react';
import styles from './DropdownField.module.css';

const DropdownField = ({ label, name, value, onChange, fetchDataFunction, optionValueKey, optionLabelKey, required }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const loadOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasAttemptedFetch(true);
    try {
      const data = await fetchDataFunction();
      setOptions(data || []);
    } catch (err) {
      console.error(`Error fetching data for ${name} (${label}):`, err);
      setError(`Nie udało się załadować danych dla pola ${label}.`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchDataFunction, name, label]);

  const handleFocus = () => {
    // Fetch options on focus. This will re-fetch every time the dropdown is focused.
    loadOptions();
  };

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(option => String(option[optionValueKey]) === selectedValue) || null;
    onChange(e, selectedOption); // Pass the original event and the full selected option object
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{label}:</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus} // Load options when the select field gains focus
        className={styles.formInput}
        required={required}
      >
        <option value="">Wybierz...</option>
        {loading && <option value="" disabled>Ładowanie...</option>}
        {!loading && Array.isArray(options) && options.map((option) => (
          <option key={option[optionValueKey]} value={option[optionValueKey]}>
            {option[optionLabelKey]}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && hasAttemptedFetch && Array.isArray(options) && options.length === 0 && (
        <p className={styles.infoMessage}>Brak dostępnych opcji.</p>
      )}
    </div>
  );
};

export default DropdownField;

