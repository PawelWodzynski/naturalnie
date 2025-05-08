import React, { useState, useEffect } from 'react';
import styles from './ProductsTable.module.css';
import ProductRow from './components/ProductRow';

// Accept selectedNadKategoriaId as a prop
const ProductsTable = ({ selectedNadKategoriaId }) => {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add selectedNadKategoriaId to the dependency array of useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      setProductsData([]); // Clear previous data on new fetch
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Brak tokenu autoryzacyjnego. Zaloguj się.");
        setIsLoading(false);
        return;
      }

      try {
        const encodedToken = encodeURIComponent(token);
        const page = 0; // Can be made dynamic later
        const size = 12; // Can be made dynamic later
        const sort = "nazwa,asc"; // Can be made dynamic later
        
        let url = `http://localhost:8080/api/app-data/produkt/paginated?token=${encodedToken}&page=${page}&size=${size}&sort=${sort}`;
        
        // Use the selectedNadKategoriaId prop to filter
        if (selectedNadKategoriaId !== null && selectedNadKategoriaId !== undefined) {
          url += `&nadKategoriaId=${selectedNadKategoriaId}`;
        }
        // If selectedNadKategoriaId is null, the parameter is not added, fetching all (or default) products as per API design

        console.log(`Fetching products with URL: ${url}`); // For debugging

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
          // If result.data is empty but success is true, it means no products for that category
          if (result.success && Array.isArray(result.data) && result.data.length === 0) {
            setProductsData([]);
          } else {
            throw new Error(result.message || 'Nie udało się pobrać danych produktów.');
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Błąd podczas pobierania produktów:", err);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [selectedNadKategoriaId]); // Re-fetch when selectedNadKategoriaId changes

  if (isLoading) {
    return <div className={styles.productsTableContainer}><p>Ładowanie produktów...</p></div>;
  }

  if (error) {
    return <div className={styles.productsTableContainer}><p style={{ color: 'red' }}>Błąd: {error}</p></div>;
  }

  return (
    <div className={styles.productsTableContainer}>
      <h2>Tabela Produktów</h2>
      {productsData.length === 0 && !isLoading && (
        <p>Brak produktów do wyświetlenia dla wybranej kategorii.</p>
      )}
      {productsData.length > 0 && (
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
            </tr>
          </thead>
          <tbody>
            {productsData.map(item => (
              <ProductRow key={item.produkt.id} productItem={item} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsTable;
