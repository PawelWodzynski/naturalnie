import React, { useState, useEffect } from 'react';
import styles from './ProductsViewContainer.module.css';
import ProductsTable from '../../components/ProductsTable';
import CartButton from '../CartButton/CartButton';
import CartView from '../CartView';
import UserDataForm from '../UserDataForm';

const ProductsViewContainer = ({ 
  selectedNadKategoriaId, 
  showCartView, 
  onToggleCartView,
  onShowPaymentView
}) => {
  const [rodzajeProduktow, setRodzajeProduktow] = useState([{ id: 0, nazwa: "Wszystko" }]);
  const [selectedRodzajProduktuId, setSelectedRodzajProduktuId] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ rodzajProduktuId: 0, searchTerm: '' });

  useEffect(() => {
    const fetchRodzajeProduktow = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Brak tokenu autoryzacyjnego.");
        setRodzajeProduktow([{ id: 0, nazwa: "Wszystko" }]);
        setSelectedRodzajProduktuId(0);
        return;
      }

      const nadKategoriaIdToFetch = selectedNadKategoriaId === null || selectedNadKategoriaId === undefined ? 0 : selectedNadKategoriaId;
      const url = `http://localhost:8080/api/app-data/rodzaj-produktu/byNadKategoria/${nadKategoriaIdToFetch}?token=${encodeURIComponent(token)}`;

      try {
        console.log(`Fetching rodzaje produktow with URL: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Błąd HTTP ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setRodzajeProduktow([{ id: 0, nazwa: "Wszystko" }, ...result.data]);
        } else {
          console.error("Nie udało się pobrać rodzajów produktów:", result.message);
          setRodzajeProduktow([{ id: 0, nazwa: "Wszystko" }]);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania rodzajów produktów:", error);
        setRodzajeProduktow([{ id: 0, nazwa: "Wszystko" }]);
      }
      setSelectedRodzajProduktuId(0);
      setSearchTerm('');
    };

    fetchRodzajeProduktow();
  }, [selectedNadKategoriaId]);

  useEffect(() => {
    setFilters({ rodzajProduktuId: selectedRodzajProduktuId, searchTerm: searchTerm });
  }, [selectedRodzajProduktuId, searchTerm]);

  const handleRodzajProduktuChange = (event) => {
    const newRodzajId = parseInt(event.target.value, 10);
    setSelectedRodzajProduktuId(newRodzajId);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.productsViewContainer}>
      {!showCartView && (
        <div className={styles.topControlsContainer}>
          <div className={styles.groupedControlsWrapper}>
            <div className={styles.filterItemContainer}>
              <label htmlFor="rodzajProduktuSelect" className={styles.filterLabel}>Rodzaj produktu: </label>
              <select 
                id="rodzajProduktuSelect" 
                value={selectedRodzajProduktuId} 
                onChange={handleRodzajProduktuChange}
                className={styles.filterSelect}
              >
                {rodzajeProduktow.map(typ => (
                  <option key={typ.id} value={typ.id}>
                    {typ.nazwa}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterItemContainer}>
              <label htmlFor="searchInput" className={styles.filterLabel}>Wyszukaj: </label>
              <input 
                type="text" 
                id="searchInput" 
                value={searchTerm} 
                onChange={handleSearchChange} 
                placeholder="Wpisz nazwę produktu..." 
                className={styles.filterInput}
              />
            </div>
            <CartButton onClick={onToggleCartView} /> 
          </div>
        </div>
      )}
      {showCartView ? (
        <div className={styles.cartAndUserDataContainer}>
          <div className={styles.userDataFormWrapper}>
            <UserDataForm />
          </div>
          <div className={styles.cartViewWrapper}>
            <CartView onShowPaymentView={onShowPaymentView} /> 
          </div>
        </div>
      ) : (
        <ProductsTable 
          selectedNadKategoriaId={selectedNadKategoriaId} 
          filters={filters}
        />
      )}
    </div>
  );
};

export default ProductsViewContainer;
