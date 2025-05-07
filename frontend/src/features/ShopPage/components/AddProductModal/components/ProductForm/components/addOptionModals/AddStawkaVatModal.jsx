import React, { useState } from 'react';
import styles from './AddRodzajProduktuModal.module.css'; // Reuse styles

const AddStawkaVatModal = ({ isOpen, onClose, onOptionSuccessfullyAdded, apiAddFunction }) => {
  const [wartosc, setWartosc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const numericValue = parseFloat(wartosc);
    if (isNaN(numericValue)) {
        setError("Wartość stawki VAT musi być liczbą.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await apiAddFunction({ wartosc: numericValue });
      if (response && response.data) {
        onOptionSuccessfullyAdded(response.data, 'stawkaVat');
        setWartosc('');
        onClose(); 
      } else {
        setError(response.message || "Nie udało się dodać opcji. Brak danych w odpowiedzi.");
      }
    } catch (err) {
      setError(err.message || "Wystąpił błąd podczas dodawania stawki VAT.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>X</button>
        <h3>Dodaj Nową Stawkę VAT</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="stawka-vat-wartosc">Wartość (%):</label>
            <input 
              type="number" 
              id="stawka-vat-wartosc" 
              value={wartosc} 
              onChange={(e) => setWartosc(e.target.value)} 
              required 
              step="0.01"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Dodawanie...' : 'Dodaj Stawkę VAT'}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStawkaVatModal;

