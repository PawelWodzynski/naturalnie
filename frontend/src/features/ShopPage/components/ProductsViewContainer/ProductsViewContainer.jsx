import React, { useState, useEffect } from 'react';
import styles from './ProductsViewContainer.module.css';
import ProductsTable from '../../components/ProductsTable';

const ProductsViewContainer = ({ selectedNadKategoriaId }) => {
  const [rodzajeProduktow, setRodzajeProduktow] = useState([{ id: 0, nazwa: "Wszystko" }]);
  const [selectedRodzajProduktuId, setSelectedRodzajProduktuId] = useState(0); // Default to 'Wszystko'
  const [filters, setFilters] = useState({ rodzajProduktuId: 0 });

  useEffect(() => {
    const fetchRodzajeProduktow = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Brak tokenu autoryzacyjnego.");
        setRodzajeProduktow([{ id: 0, nazwa: "Wszystko" }]);
        setSelectedRodzajProduktuId(0); // Reset on error or no token
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
      // Reset selectedRodzajProduktuId to 'Wszystko' when nadKategoria changes
      setSelectedRodzajProduktuId(0);
    };

    fetchRodzajeProduktow();
  }, [selectedNadKategoriaId]);

  useEffect(() => {
    setFilters(prevFilters => ({ ...prevFilters, rodzajProduktuId: selectedRodzajProduktuId }));
  }, [selectedRodzajProduktuId]);

  const handleRodzajProduktuChange = (event) => {
    const newRodzajId = parseInt(event.target.value, 10);
    setSelectedRodzajProduktuId(newRodzajId);
  };

  return (
    <div className={styles.productsViewContainer}>
      <div className={styles.filterContainer}>
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
      <ProductsTable 
        selectedNadKategoriaId={selectedNadKategoriaId} 
        filters={filters}
      />
    </div>
  );
};

export default ProductsViewContainer;

