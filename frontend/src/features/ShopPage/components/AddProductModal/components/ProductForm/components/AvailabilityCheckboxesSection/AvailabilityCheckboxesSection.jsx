import React from 'react';
import styles from './AvailabilityCheckboxesSection.module.css';

const AvailabilityCheckboxesSection = ({ formData, handleInputChange }) => {
  return (
    <div className={styles.formGroupCheckboxesFullWidth}>
      <h4 className={styles.checkboxGroupTitle}>Dostępność:</h4>
      <div className={styles.checkboxGrid}>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="dostepny" name="dostepny" checked={formData.dostepny} onChange={handleInputChange} />
          <label htmlFor="dostepny">Dostępny</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="dostepneOdReki" name="dostepneOdReki" checked={formData.dostepneOdReki} onChange={handleInputChange} />
          <label htmlFor="dostepneOdReki">Dostępne od Ręki</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="dostepneDo7Dni" name="dostepneDo7Dni" checked={formData.dostepneDo7Dni} onChange={handleInputChange} />
          <label htmlFor="dostepneDo7Dni">Dostępne do 7 Dni</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="dostepneNaZamowienie" name="dostepneNaZamowienie" checked={formData.dostepneNaZamowienie} onChange={handleInputChange} />
          <label htmlFor="dostepneNaZamowienie">Dostępne na Zamówienie</label>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCheckboxesSection;

