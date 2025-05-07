import React, { useState } from 'react';
import styles from './AddRodzajProduktuModal.module.css'; // Reuse styles

const AddOpakowanieModal = ({ isOpen, onClose, onOptionSuccessfullyAdded, apiAddFunction }) => {
  const [nazwa, setNazwa] = useState('');
  const [skrot, setSkrot] = useState('');
  const [opis, setOpis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!nazwa.trim()) {
        setError("Nazwa opakowania jest wymagana.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await apiAddFunction({ nazwa, skrot, opis });
      if (response && response.data) {
        onOptionSuccessfullyAdded(response.data, 'opakowanie');
        setNazwa('');
        setSkrot('');
        setOpis('');
        onClose(); 
      } else {
        setError(response.message || "Nie udało się dodać opcji. Brak danych w odpowiedzi.");
      }
    } catch (err) {
      setError(err.message || "Wystąpił błąd podczas dodawania opakowania.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>X</button>
        <h3>Dodaj Nowe Opakowanie</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="opakowanie-nazwa">Nazwa:</label>
            <input 
              type="text" 
              id="opakowanie-nazwa" 
              value={nazwa} 
              onChange={(e) => setNazwa(e.target.value)} 
              required 
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="opakowanie-skrot">Skrót:</label>
            <input 
              type="text" 
              id="opakowanie-skrot" 
              value={skrot} 
              onChange={(e) => setSkrot(e.target.value)} 
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="opakowanie-opis">Opis:</label>
            <textarea 
              id="opakowanie-opis" 
              value={opis} 
              onChange={(e) => setOpis(e.target.value)} 
              rows="3"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Dodawanie...' : 'Dodaj Opakowanie'}
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

export default AddOpakowanieModal;

