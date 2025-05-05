import React from 'react';
import styles from './UserDataSection.module.css';

const UserDataSection = ({ formData, handleChange }) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend>Dane Podstawowe</legend>
      <div className={styles.formGroup}>
        <label htmlFor="userName">Username</label>
        <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
    </fieldset>
  );
};

export default UserDataSection;

