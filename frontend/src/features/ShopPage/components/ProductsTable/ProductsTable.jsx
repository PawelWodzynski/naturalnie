import React, { useState, useEffect } from 'react';
import styles from './ProductsTable.module.css';
import ProductRow from './components/ProductRow';
import ProductDetailModal from '../ProductDetailModal'; // Import the modal

const ProductsTable = ({ selectedNadKategoriaId }) => {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for ProductDetailModal
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [selectedProductItem, setSelectedProductItem] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      setProductsData([]);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Brak tokenu autoryzacyjnego. Zaloguj się.");
        setIsLoading(false);
        return;
      }

      try {
        const encodedToken = encodeURIComponent(token);
        const page = 0;
        const size = 12;
        const sort = "nazwa,asc";
        
        let url = `http://localhost:8080/api/app-data/produkt/paginated?token=${encodedToken}&page=${page}&size=${size}&sort=${sort}`;
        
        if (selectedNadKategoriaId !== null && selectedNadKategoriaId !== undefined) {
          url += `&nadKategoriaId=${selectedNadKategoriaId}`;
        }

        console.log(`Fetching products with URL: ${url}`);

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
  }, [selectedNadKategoriaId]);

  const handleProductRowClick = (productItem) => {
    setSelectedProductItem(productItem);
    setIsProductDetailModalOpen(true);
    console.log("Product row clicked, opening modal for:", productItem);
  };

  const handleCloseProductDetailModal = () => {
    setIsProductDetailModalOpen(false);
    setSelectedProductItem(null);
  };

  if (isLoading) {
    return <div className={styles.productsTableContainer}><p>Ładowanie produktów...</p></div>;
  }

  if (error) {
    return <div className={styles.productsTableContainer}><p style={{ color: 'red' }}>Błąd: {error}</p></div>;
  }

  return (
    <>
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
                <ProductRow 
                  key={item.produkt.id} 
                  productItem={item} 
                  onRowClick={handleProductRowClick} // Pass the click handler
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ProductDetailModal 
        isOpen={isProductDetailModalOpen} 
        onClose={handleCloseProductDetailModal} 
        productItem={selectedProductItem} 
      />
    </>
  );
};

export default ProductsTable;

