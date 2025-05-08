import React from 'react';
import styles from './ProductCodesSection.module.css';

const ProductCodesSection = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="kodTowaruKod">Kod Towaru:</label>
        <input type="text" id="kodTowaruKod" name="kodTowaruKod" value={formData.kodTowaruKod} onChange={handleInputChange} className={styles.formInput} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="kodEanKod">Kod EAN:</label>
        <input type="text" id="kodEanKod" name="kodEanKod" value={formData.kodEanKod} onChange={handleInputChange} className={styles.formInput} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="identyfikatorWartosc">Identyfikator:</label>
        <input type="text" id="identyfikatorWartosc" name="identyfikatorWartosc" value={formData.identyfikatorWartosc} onChange={handleInputChange} className={styles.formInput} />
      </div>
    </>
  );
};

export default ProductCodesSection;

