import React from 'react';
import styles from './ProductTypeDropdown.module.css';

const ProductTypeDropdown = ({ value, onChange, options, placeholder = "Wybierz rodzaj produktu" }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={styles.productTypeDropdown}
    >
      <option value="" disabled>{placeholder}</option>
      {options && options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ProductTypeDropdown;

