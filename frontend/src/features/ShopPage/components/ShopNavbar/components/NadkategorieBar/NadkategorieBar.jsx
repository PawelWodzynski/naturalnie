import React, { useState, useEffect } from 'react';
import styles from './NadkategorieBar.module.css';

const NadkategorieBar = ({ apiToken }) => {
  const [nadkategorie, setNadkategorie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiToken) {
      // setError('Brak tokenu API do pobrania nadkategorii.'); // Or simply don't fetch
      return;
    }

    const fetchNadkategorie = async () => {
      setLoading(true);
      setError(null);
      try {
        const encodedToken = encodeURIComponent(apiToken);
        const response = await fetch(`http://localhost:8080/api/app-data/nad-kategoria?token=${encodedToken}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json', // Not strictly needed for GET
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Nie udało się przetworzyć odpowiedzi błędu serwera.' }));
          throw new Error(`Błąd serwera: ${response.status} - ${errorData.message || 'Nieznany błąd podczas pobierania nadkategorii'}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setNadkategorie(data.data);
        } else {
          throw new Error(data.message || 'Nieprawidłowy format danych odpowiedzi API dla nadkategorii.');
        }
      } catch (err) {
        setError(err.message);
        setNadkategorie([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchNadkategorie();
  }, [apiToken]);

  if (loading) {
    return <div className={styles.loadingMessage}>Ładowanie nadkategorii...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (nadkategorie.length === 0) {
    return <div className={styles.noDataMessage}>Brak nadkategorii do wyświetlenia.</div>;
  }

  return (
    <div className={styles.nadkategorieContainer}>
      {nadkategorie.map((nadkategoria) => (
        <button 
          key={nadkategoria.id} 
          className={styles.nadkategoriaButton}
          // onClick={() => console.log('Nadkategoria clicked:', nadkategoria.nazwa)} // Placeholder for future action
        >
          {nadkategoria.nazwa}
        </button>
      ))}
    </div>
  );
};

export default NadkategorieBar;

