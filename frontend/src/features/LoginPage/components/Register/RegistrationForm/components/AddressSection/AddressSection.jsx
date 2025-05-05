import React from 'react';
import styles from './AddressSection.module.css';

// Receive isCompanyAddress prop
const AddressSection = ({ formData, handleChange, isCompanyAddress }) => {
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
        <label htmlFor="apartmentNumber">Numer mieszkania</label>
        <input type="text" id="apartmentNumber" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="postalCode">Kod pocztowy</label>
        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required pattern="\d{2}-\d{3}" title="Format XX-XXX" />
      </div>
      {/* Row with City, Voivodeship, District, Commune */}
      <div className={styles.formGroup}>
        <label htmlFor="city">Miasto</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="voivodeship">Województwo</label>
        <input type="text" id="voivodeship" name="voivodeship" value={formData.voivodeship} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="district">Powiat</label>
        <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="commune">Gmina</label>
        <input type="text" id="commune" name="commune" value={formData.commune} onChange={handleChange} />
      </div>

      {/* Centered row for Phone, NIP, Company Name */}
      <div className={styles.centeredRow}>
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Numer telefonu</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        {/* Apply conditional class and disabled attribute */}
        <div className={`${styles.formGroup} ${!isCompanyAddress ? styles.disabledField : ''}`}>
          <label htmlFor="nip">NIP</label>
          <input
            type="text"
            id="nip"
            name="nip"
            value={formData.nip}
            onChange={handleChange}
            disabled={!isCompanyAddress} // Disable if not company address
          />
        </div>
        {/* Apply conditional class and disabled attribute */}
        <div className={`${styles.formGroup} ${!isCompanyAddress ? styles.disabledField : ''}`}>
          <label htmlFor="companyName">Nazwa firmy</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            disabled={!isCompanyAddress} // Disable if not company address
          />
          {/* Add radio button (using checkbox for toggle behavior) */}
          <div className={styles.radioContainer}>
            <input
              type="checkbox" // Using checkbox as a toggle
              id="isCompanyAddressRadio"
              name="isCompanyAddressRadio"
              checked={isCompanyAddress}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="isCompanyAddressRadio" className={styles.radioLabel}>firma</label>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default AddressSection;

