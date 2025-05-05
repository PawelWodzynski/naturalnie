import React from 'react';
import styles from './ConsentSection.module.css';

const ConsentSection = ({ formData, handleChange }) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend>Zgody</legend>
      <div className={styles.checkboxGroup}>
        <input type="checkbox" id="rodoConsent" name="rodoConsent" checked={formData.rodoConsent} onChange={handleChange} />
        <label htmlFor="rodoConsent">Zgoda RODO (wymagana)</label>
      </div>
      <div className={styles.checkboxGroup}>
        <input type="checkbox" id="termsConsent" name="termsConsent" checked={formData.termsConsent} onChange={handleChange} />
        <label htmlFor="termsConsent">Akceptacja regulaminu (wymagana)</label>
      </div>
      <div className={styles.checkboxGroup}>
        <input type="checkbox" id="marketingConsent" name="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} />
        <label htmlFor="marketingConsent">Zgoda marketingowa (opcjonalna)</label>
      </div>
    </fieldset>
  );
};

export default ConsentSection;

