import React from 'react';
import styles from './SearchInput.module.css';

const SearchInput = ({ value, onChange, placeholder = "Wyszukaj..." }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={styles.searchInput}
    />
  );
};

export default SearchInput;

