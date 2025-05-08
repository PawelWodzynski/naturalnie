import React, { useState, useEffect } from 'react';
import styles from './NadkategorieBar.module.css';
import { useNadkategorie } from '../../../../../../context/NadkategorieContext' // Import the context hook

const NadkategorieBar = ({ apiToken, onCategoryClick }) => {
  const [nadkategorie, setNadkategorie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { refreshKey } = useNadkategorie(); // Consume the context

  useEffect(() => {
    if (!apiToken) {
      return;
    }

    const fetchNadkategorie = async () => {
      setLoading(true);
      setError(null);
      console.log("NadkategorieBar: Fetching nadkategorie due to token or refreshKey change. Refresh key:", refreshKey);
      try {
        const encodedToken = encodeURIComponent(apiToken);
        const response = await fetch(`http://localhost:8080/api/app-data/nad-kategoria?token=${encodedToken}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );

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
        setNadkategorie([]); // Clear categories on error
      } finally {
        setLoading(false);
      }
    };

    fetchNadkategorie();
  }, [apiToken, refreshKey]); // Add refreshKey to the dependency array

  if (loading) {
    return <div className={styles.loadingMessage}>Ładowanie nadkategorii...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  // It's better to show a message if no categories are found after a successful fetch
  // rather than treating it as an error state, unless the API guarantees categories.
  if (nadkategorie.length === 0 && !loading) { // Check !loading to avoid showing this during initial load
    return <div className={styles.noDataMessage}>Brak nadkategorii do wyświetlenia.</div>;
  }

  return (
    <div className={styles.nadkategorieContainer}>
      {nadkategorie.map((nadkategoria) => (
        <button 
          key={nadkategoria.id} 
          className={styles.nadkategoriaButton}
          onClick={() => onCategoryClick && onCategoryClick(nadkategoria.id)}
        >
          {nadkategoria.nazwa}
        </button>
      ))}
    </div>
  );
};

export default NadkategorieBar;

