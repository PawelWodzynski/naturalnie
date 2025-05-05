import React from 'react';
import styles from './AddressSection.module.css';

const AddressSection = ({ formData, handleChange }) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend>Adres</legend>
      <div className={styles.formGroup}>
        <label htmlFor="street">Ulica</label>
        <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="buildingNumber">Numer budynku</label>
        <input type="text" id="buildingNumber" name="buildingNumber" value={formData.buildingNumber} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="apartmentNumber">Numer mieszkania (opcjonalnie)</label>
        <input type="text" id="apartmentNumber" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="postalCode">Kod pocztowy</label>
        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required pattern="\d{2}-\d{3}" title="Format XX-XXX" />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="city">Miasto</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="voivodeship">Województwo (opcjonalnie)</label>
        <input type="text" id="voivodeship" name="voivodeship" value={formData.voivodeship} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="district">Powiat (opcjonalnie)</label>
        <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="commune">Gmina (opcjonalnie)</label>
        <input type="text" id="commune" name="commune" value={formData.commune} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phoneNumber">Numer telefonu (opcjonalnie)</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
      </div>
    </fieldset>
  );
};

export default AddressSection;

