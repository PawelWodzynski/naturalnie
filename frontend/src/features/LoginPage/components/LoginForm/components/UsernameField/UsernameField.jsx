import React from 'react';
import styles from './UsernameField.module.css';

const UsernameField = ({ value, onChange }) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor="username" className={styles.label}>Nazwa użytkownika</label>
      <input
        type="text"
        id="username"
        className={styles.input}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default UsernameField;

