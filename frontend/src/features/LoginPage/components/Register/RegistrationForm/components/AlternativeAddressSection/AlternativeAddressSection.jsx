import React from 'react';
import styles from './AlternativeAddressSection.module.css'; // Use its own CSS module

// Receive isAltCompanyAddress prop
const AlternativeAddressSection = ({ formData, handleChange, isAltCompanyAddress }) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend>Adres Alternatywny</legend> {/* Changed legend */}
      <div className={styles.formGroup}>
        <label htmlFor="altStreet">Ulica</label>
        <input type="text" id="altStreet" name="altStreet" value={formData.altStreet} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="altBuildingNumber">Numer budynku</label>
        <input type="text" id="altBuildingNumber" name="altBuildingNumber" value={formData.altBuildingNumber} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="altApartmentNumber">Numer mieszkania</label>
        <input type="text" id="altApartmentNumber" name="altApartmentNumber" value={formData.altApartmentNumber} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="altPostalCode">Kod pocztowy</label>
        <input type="text" id="altPostalCode" name="altPostalCode" value={formData.altPostalCode} onChange={handleChange} required pattern="\d{2}-\d{3}" title="Format XX-XXX" />
      </div>
      {/* Row with City, Voivodeship, District, Commune */}
      <div className={styles.formGroup}>
        <label htmlFor="altCity">Miasto</label>
        <input type="text" id="altCity" name="altCity" value={formData.altCity} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="altVoivodeship">Województwo</label>
        <input type="text" id="altVoivodeship" name="altVoivodeship" value={formData.altVoivodeship} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="altDistrict">Powiat</label>
        <input type="text" id="altDistrict" name="altDistrict" value={formData.altDistrict} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="altCommune">Gmina</label>
        <input type="text" id="altCommune" name="altCommune" value={formData.altCommune} onChange={handleChange} />
      </div>

      {/* Centered row for Phone, NIP, Company Name */}
      <div className={styles.centeredRow}>
        <div className={styles.formGroup}>
          <label htmlFor="altPhoneNumber">Numer telefonu</label>
          <input type="tel" id="altPhoneNumber" name="altPhoneNumber" value={formData.altPhoneNumber} onChange={handleChange} required />
        </div>
        {/* Apply conditional class and disabled attribute */}
        <div className={`${styles.formGroup} ${!isAltCompanyAddress ? styles.disabledField : ''}`}>
          <label htmlFor="altNip">NIP</label>
          <input
            type="text"
            id="altNip"
            name="altNip"
            value={formData.altNip}
            onChange={handleChange}
            disabled={!isAltCompanyAddress} // Disable if not alt company address
          />
        </div>
        {/* Apply conditional class and disabled attribute */}
        <div className={`${styles.formGroup} ${!isAltCompanyAddress ? styles.disabledField : ''}`}>
          <label htmlFor="altCompanyName">Nazwa firmy</label>
          <input
            type="text"
            id="altCompanyName"
            name="altCompanyName"
            value={formData.altCompanyName}
            onChange={handleChange}
            disabled={!isAltCompanyAddress} // Disable if not alt company address
          />
          {/* Add radio button (using checkbox for toggle behavior) */}
          <div className={styles.radioContainer}>
            <input
              type="checkbox" // Using checkbox as a toggle
              id="isAltCompanyAddressRadio"
              name="isAltCompanyAddressRadio"
              checked={isAltCompanyAddress}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <label htmlFor="isAltCompanyAddressRadio" className={styles.radioLabel}>firma</label>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default AlternativeAddressSection;

