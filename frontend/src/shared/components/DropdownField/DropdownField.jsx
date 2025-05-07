import React, { useState, useEffect } from 'react';
import styles from './DropdownField.module.css';

const DropdownField = ({ label, name, value, onChange, fetchDataFunction, optionValueKey, optionLabelKey, setHiddenFields, initialFormData }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDataFunction();
        setOptions(data || []);
      } catch (err) {
        console.error(`Error fetching data for ${name}:`, err);
        setError(`Nie udało się załadować danych dla ${label}.`);
        setOptions([]); // Ensure options is an array even on error
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, [fetchDataFunction, name, label]);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(option => String(option[optionValueKey]) === selectedValue);

    onChange(e); // Update the main form data for the visible field

    if (selectedOption && setHiddenFields) {
      setHiddenFields(selectedOption, initialFormData); // Pass initialFormData to allow resetting other fields if needed
    }
  };

  if (loading) {
    return <div className={styles.formGroup}><label htmlFor={name}>{label}:</label><p>Ładowanie...</p></div>;
  }

  if (error) {
    return <div className={styles.formGroup}><label htmlFor={name}>{label}:</label><p className={styles.errorMessage}>{error}</p></div>;
  }

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{label}:</label>
      <select 
        id={name} 
        name={name} 
        value={value} 
        onChange={handleChange} 
        className={styles.formInput}
        required
      >
        <option value="">Wybierz...</option>
        {Array.isArray(options) && options.map((option) => (
          <option key={option[optionValueKey]} value={option[optionValueKey]}>
            {option[optionLabelKey]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownField;

