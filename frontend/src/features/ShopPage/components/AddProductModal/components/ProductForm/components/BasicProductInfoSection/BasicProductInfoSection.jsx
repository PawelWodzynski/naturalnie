import React from 'react';
import styles from './BasicProductInfoSection.module.css';

const BasicProductInfoSection = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="nazwa">Nazwa Produktu:</label>
        <input type="text" id="nazwa" name="nazwa" value={formData.nazwa} onChange={handleInputChange} required className={styles.formInput} />
      </div>
      <div className={styles.formGroupFullWidth}>
        <label htmlFor="opis">Opis Produktu:</label>
        <textarea id="opis" name="opis" value={formData.opis} onChange={handleInputChange} rows="4" className={styles.formInput}></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="waga">Waga (kg):</label>
        <input type="number" id="waga" name="waga" value={formData.waga} onChange={handleInputChange} step="0.01" className={styles.formInput} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="cena">Cena (PLN):</label>
        <input type="number" id="cena" name="cena" value={formData.cena} onChange={handleInputChange} step="0.01" className={styles.formInput} />
      </div>
    </>
  );
};

export default BasicProductInfoSection;

