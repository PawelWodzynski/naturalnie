import React, { useState } from 'react';
import styles from './AddRodzajProduktuModal.module.css';

// Placeholder for the actual API call - will be moved to apiService.js later
// const addRodzajProduktuAPI = async (data) => {
//   console.log("Simulating API call to add Rodzaj Produktu:", data);
//   // Simulate API delay and response
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (data.nazwa) {
//         resolve({ data: { id: Date.now(), ...data }, success: true, message: "Utworzono nowy rodzaj produktu." });
//       } else {
//         reject(new Error("Nazwa jest wymagana."));
//       }
//     }, 1000);
//   });
// };

const AddRodzajProduktuModal = ({ isOpen, onClose, onOptionSuccessfullyAdded, apiAddFunction }) => {
  const [nazwa, setNazwa] = useState('');
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
        setError("Nazwa rodzaju produktu jest wymagana.");
        setIsSubmitting(false);
        return;
    }

    try {
      // const response = await addRodzajProduktuAPI({ nazwa, opis }); // Placeholder
      const response = await apiAddFunction({ nazwa, opis }); // Use passed API function
      if (response && response.data) {
        onOptionSuccessfullyAdded(response.data, 'rodzajProduktu');
        setNazwa('');
        setOpis('');
        onClose(); 
      } else {
        setError(response.message || "Nie udało się dodać opcji. Brak danych w odpowiedzi.");
      }
    } catch (err) {
      setError(err.message || "Wystąpił błąd podczas dodawania rodzaju produktu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting}>X</button>
        <h3>Dodaj Nowy Rodzaj Produktu</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="rodzaj-nazwa">Nazwa:</label>
            <input 
              type="text" 
              id="rodzaj-nazwa" 
              value={nazwa} 
              onChange={(e) => setNazwa(e.target.value)} 
              required 
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rodzaj-opis">Opis:</label>
            <textarea 
              id="rodzaj-opis" 
              value={opis} 
              onChange={(e) => setOpis(e.target.value)} 
              rows="3"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Dodawanie...' : 'Dodaj Rodzaj'}
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

export default AddRodzajProduktuModal;

