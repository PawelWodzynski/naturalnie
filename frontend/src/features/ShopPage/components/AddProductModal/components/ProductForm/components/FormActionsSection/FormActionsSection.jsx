import React from 'react';
import styles from './FormActionsSection.module.css';

const FormActionsSection = ({ onClose, isSubmitting }) => {
  return (
    <div className={styles.formActionsMain}>
      <button type="button" onClick={onClose} className={`${styles.buttonMain} ${styles.cancelButtonMain}`} disabled={isSubmitting}>
        Anuluj
      </button>
      <button type="submit" className={`${styles.buttonMain} ${styles.submitButtonMain}`} disabled={isSubmitting}>
        {isSubmitting ? 'Dodawanie Produktu...' : 'Dodaj Produkt'}
      </button>
    </div>
  );
};

export default FormActionsSection;

