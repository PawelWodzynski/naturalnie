import React, { useState } from 'react';
import styles from './AddRodzajProduktuModal.module.css'; // Reuse styles if similar, or create new if needed

const AddJednostkaModal = ({ isOpen, onClose, onOptionSuccessfullyAdded, apiAddFunction }) => {
  const [nazwa, setNazwa] = useState('');
  const [skrot, setSkrot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!nazwa.trim() || !skrot.trim()) {
        setError("Nazwa jednostki oraz skrót są wymagane.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await apiAddFunction({ nazwa, skrot });
      if (response && response.data) {
        onOptionSuccessfullyAdded(response.data, 'jednostka');
        setNazwa('');
        setSkrot('');
        onClose(); 
      } else {
        setError(response.message || "Nie udało się dodać opcji. Brak danych w odpowiedzi.");
      }
    } catch (err) {
      setError(err.message || "Wystąpił błąd podczas dodawania jednostki.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>X</button>
        <h3>Dodaj Nową Jednostkę</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="jednostka-nazwa">Nazwa:</label>
            <input 
              type="text" 
              id="jednostka-nazwa" 
              value={nazwa} 
              onChange={(e) => setNazwa(e.target.value)} 
              required 
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="jednostka-skrot">Skrót:</label>
            <input 
              type="text" 
              id="jednostka-skrot" 
              value={skrot} 
              onChange={(e) => setSkrot(e.target.value)} 
              required 
              className={styles.formInput}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Dodawanie...' : 'Dodaj Jednostkę'}
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

export default AddJednostkaModal;

