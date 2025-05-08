import React from 'react';
import styles from './ProductOptionsCheckboxesSection.module.css';

const ProductOptionsCheckboxesSection = ({ formData, handleInputChange }) => {
  return (
    <div className={styles.formGroupCheckboxesFullWidth}>
      <h4 className={styles.checkboxGroupTitle}>Opcje Produktu:</h4>
      <div className={styles.checkboxGrid}>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="superProdukt" name="superProdukt" checked={formData.superProdukt} onChange={handleInputChange} />
          <label htmlFor="superProdukt">Super Produkt</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="towarPolecany" name="towarPolecany" checked={formData.towarPolecany} onChange={handleInputChange} />
          <label htmlFor="towarPolecany">Towar Polecany</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="rekomendacjaSprzedawcy" name="rekomendacjaSprzedawcy" checked={formData.rekomendacjaSprzedawcy} onChange={handleInputChange} />
          <label htmlFor="rekomendacjaSprzedawcy">Rekomendacja Sprzedawcy</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="superCena" name="superCena" checked={formData.superCena} onChange={handleInputChange} />
          <label htmlFor="superCena">Super Cena</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="nowosc" name="nowosc" checked={formData.nowosc} onChange={handleInputChange} />
          <label htmlFor="nowosc">Nowość</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="superjakosc" name="superjakosc" checked={formData.superjakosc} onChange={handleInputChange} />
          <label htmlFor="superjakosc">Super Jakość</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="rabat" name="rabat" checked={formData.rabat} onChange={handleInputChange} />
          <label htmlFor="rabat">Rabat</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="wartoKupic" name="wartoKupic" checked={formData.wartoKupic} onChange={handleInputChange} />
          <label htmlFor="wartoKupic">Warto Kupić</label>
        </div>
        <div className={styles.checkboxItem}>
          <input type="checkbox" id="bezglutenowy" name="bezglutenowy" checked={formData.bezglutenowy} onChange={handleInputChange} />
          <label htmlFor="bezglutenowy">Bezglutenowy</label>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsCheckboxesSection;

