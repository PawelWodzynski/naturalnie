import React, { useState, useEffect } from 'react';
import styles from './ProductsTable.module.css';
import ProductRow from './components/ProductRow';
import ProductDetailModal from '../ProductDetailModal'; // Import the modal

const ProductsTable = ({ selectedNadKategoriaId, filters }) => { // Added filters prop
  const [productsData, setProductsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageQuantity, setPageQuantity] = useState(0);
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
      // setPageQuantity(0); // Resetting pageQuantity here might be problematic if filters change but page count is still valid
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Brak tokenu autoryzacyjnego. Zaloguj się.");
        setIsLoading(false);
        return;
      }

      try {
        const encodedToken = encodeURIComponent(token);
        // const page = 0; // Will use currentPage state
        const size = 12; // Consider making size configurable or larger
        const sort = "nazwa,asc";
        
        let url = `http://localhost:8080/api/app-data/produkt/paginated?token=${encodedToken}&page=${currentPage}&size=${size}&sort=${sort}`;
        
        if (selectedNadKategoriaId !== null && selectedNadKategoriaId !== undefined) {
          url += `&nadKategoriaId=${selectedNadKategoriaId}`;
        }

        // Apply filters if they exist
        if (filters) {
          if (filters.searchTerm) {
            url += `&search=${encodeURIComponent(filters.searchTerm)}`;
          }
          if (filters.productType) {
            url += `&rodzajProduktuId=${filters.productType}`;
          }
          if (filters.availability !== undefined) { // Assuming availability is boolean or specific values
            url += `&dostepny=${filters.availability}`;
          }
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
        if (result.success && result.data && result.data.produkty) {
          setProductsData(result.data.produkty);
          setPageQuantity(result.data.pageQuantity);
        } else {
          if (result.success && Array.isArray(result.data.produkty) && result.data.produkty.length === 0) {
            setProductsData([]); // No data found
            setPageQuantity(0);
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
  }, [selectedNadKategoriaId, filters, currentPage]); // Added filters and currentPage to dependency array

  const handleProductRowClick = (productItem) => {
    setSelectedProductItem(productItem);
    setIsProductDetailModalOpen(true);
    console.log("Product row clicked, opening modal for:", productItem);
  };

  const handleCloseProductDetailModal = () => {
    setIsProductDetailModalOpen(false);
    setSelectedProductItem(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    // Changed to a simpler loading message, container style is now in ProductsViewContainer
    return <p>Ładowanie produktów...</p>; 
  }

  if (error) {
    return <p style={{ color: 'red' }}>Błąd: {error}</p>;
  }

  return (
    <>
      {/* Removed the h2 header and the outer productsTableContainer div, as styling will be handled by ProductsViewContainer */}
      {productsData.length === 0 && !isLoading && (
        <p>Brak produktów do wyświetlenia dla wybranych kryteriów.</p>
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
                onRowClick={handleProductRowClick}
              />
            ))}
          </tbody>
        </table>
      )}
      <ProductDetailModal 
        isOpen={isProductDetailModalOpen} 
        onClose={handleCloseProductDetailModal} 
        productItem={selectedProductItem} 
      />
      {pageQuantity > 1 && (
        <div className={styles.paginationContainer}>
          {Array.from({ length: pageQuantity }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={currentPage === index ? styles.activePage : styles.pageButton}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductsTable;

