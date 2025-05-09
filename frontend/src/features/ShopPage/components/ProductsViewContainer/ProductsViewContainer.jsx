import React, { useState, useCallback } from 'react';
import styles from './ProductsViewContainer.module.css';
import FilterPanel from './components/FilterPanel';
import ProductsTable from '../../components/ProductsTable'; // Corrected path assuming ProductsTable is in ShopPage/components/

const ProductsViewContainer = ({ selectedNadKategoriaId }) => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = useCallback((newFilters) => {
    console.log("Filters updated in ProductsViewContainer:", newFilters);
    setFilters(newFilters);
  }, []);

  return (
    <div className={styles.productsViewContainer}>
      <FilterPanel onFilterChange={handleFilterChange} />
      <ProductsTable 
        selectedNadKategoriaId={selectedNadKategoriaId} 
        filters={filters} // Pass filters to ProductsTable
      />
    </div>
  );
};

export default ProductsViewContainer;

