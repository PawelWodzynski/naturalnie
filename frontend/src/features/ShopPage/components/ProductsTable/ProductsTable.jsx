import React, { useState, useEffect } from 'react';
import styles from './ProductsTable.module.css';
import ProductRow from './components/ProductRow'; // Will create this next

const ProductsTable = () => {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Brak tokenu autoryzacyjnego. Zaloguj się.");
        setIsLoading(false);
        return;
      }

      try {
        const encodedToken = encodeURIComponent(token);
        // Parameters from user's cURL, can be made dynamic later
        const page = 0;
        const size = 12;
        const nadKategoriaId = 4; // Example, make dynamic if needed
        const sort = "nazwa,asc";
        
        let url = `http://localhost:8080/api/app-data/produkt/paginated?token=${encodedToken}&page=${page}&size=${size}&sort=${sort}`;
        if (nadKategoriaId) {
          url += `&nadKategoriaId=${nadKategoriaId}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Nieznany błąd serwera' }));
          throw new Error(`Błąd HTTP ${response.status}: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          setProductsData(result.data);
        } else {
          throw new Error(result.message || 'Nie udało się pobrać danych produktów.');
        }
      } catch (err) {
        setError(err.message);
        console.error("Błąd podczas pobierania produktów:", err);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className={styles.productsTableContainer}><p>Ładowanie produktów...</p></div>;
  }

  if (error) {
    return <div className={styles.productsTableContainer}><p style={{ color: 'red' }}>Błąd: {error}</p></div>;
  }

  if (productsData.length === 0) {
    return <div className={styles.productsTableContainer}><p>Brak produktów do wyświetlenia.</p></div>;
  }

  return (
    <div className={styles.productsTableContainer}>
      <h2>Tabela Produktów</h2>
      <table className={styles.productsTable}>
        <thead>
          <tr>
            <th>Kod EAN</th>
            <th>Zdjęcie</th>
            <th>Nazwa produktu</th>
            <th>Rodzaj Produktu</th>
            <th>Dostępność</th>
            <th>Cena (zł)</th>
            <th>Ilość</th>
            {/* Akcje będą w kolumnie Ilość jako przycisk "Dodaj" */}
          </tr>
        </thead>
        <tbody>
          {productsData.map(item => (
            <ProductRow key={item.produkt.id} productItem={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;

