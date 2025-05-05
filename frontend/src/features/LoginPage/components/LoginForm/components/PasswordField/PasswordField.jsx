import React from 'react';
import styles from './PasswordField.module.css';

const PasswordField = ({ value, onChange }) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor="password" className={styles.label}>Hasło</label>
      <input
        type="password"
        id="password"
        className={styles.input}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default PasswordField;

