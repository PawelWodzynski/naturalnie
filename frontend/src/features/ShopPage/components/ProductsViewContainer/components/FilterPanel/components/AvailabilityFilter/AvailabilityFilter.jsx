import React from 'react';
import styles from './AvailabilityFilter.module.css';

// Example: A simple toggle or a set of radio buttons/checkboxes
// For simplicity, let's use a dropdown for now, similar to ProductTypeDropdown
// Or checkboxes for 'Available', 'Unavailable', 'All'

const AvailabilityFilter = ({ selectedValue, onChange }) => {
  // Options could be: '', 'true', 'false'
  const options = [
    { value: '', label: 'Wszystkie' },
    { value: 'true', label: 'Dostępne' },
    { value: 'false', label: 'Niedostępne' },
  ];

  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value); // Pass the boolean value or empty string
    }
  };

  return (
    <div className={styles.availabilityFilterContainer}>
      <label htmlFor="availability-select" className={styles.filterLabel}>Dostępność:</label>
      <select
        id="availability-select"
        value={selectedValue}
        onChange={handleChange}
        className={styles.availabilitySelect}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AvailabilityFilter;

