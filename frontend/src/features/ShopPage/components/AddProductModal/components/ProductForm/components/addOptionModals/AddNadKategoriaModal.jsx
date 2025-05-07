import React, { useState } from 'react';
import styles from './AddRodzajProduktuModal.module.css'; // Reuse styles

const AddNadKategoriaModal = ({ isOpen, onClose, onOptionSuccessfullyAdded, apiAddFunction }) => {
  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');
  const [kolejnosc, setKolejnosc] = useState(0);
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
        setError("Nazwa nadkategorii jest wymagana.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await apiAddFunction({ nazwa, opis, kolejnosc: parseInt(kolejnosc, 10) || 0 });
      if (response && response.data) {
        onOptionSuccessfullyAdded(response.data, 'nadKategoria');
        setNazwa('');
        setOpis('');
        setKolejnosc(0);
        onClose(); 
      } else {
        setError(response.message || "Nie udało się dodać opcji. Brak danych w odpowiedzi.");
      }
    } catch (err) {
      setError(err.message || "Wystąpił błąd podczas dodawania nadkategorii.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>X</button>
        <h3>Dodaj Nową Nadkategorię</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nadkategoria-nazwa">Nazwa:</label>
            <input 
              type="text" 
              id="nadkategoria-nazwa" 
              value={nazwa} 
              onChange={(e) => setNazwa(e.target.value)} 
              required 
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nadkategoria-opis">Opis:</label>
            <textarea 
              id="nadkategoria-opis" 
              value={opis} 
              onChange={(e) => setOpis(e.target.value)} 
              rows="3"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nadkategoria-kolejnosc">Kolejność:</label>
            <input 
              type="number" 
              id="nadkategoria-kolejnosc" 
              value={kolejnosc} 
              onChange={(e) => setKolejnosc(e.target.value)} 
              className={styles.formInput}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Dodawanie...' : 'Dodaj Nadkategorię'}
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

export default AddNadKategoriaModal;

