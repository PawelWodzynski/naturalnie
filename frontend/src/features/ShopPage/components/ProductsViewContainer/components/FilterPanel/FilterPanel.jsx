import React, { useEffect } from 'react';
import styles from './FilterPanel.module.css';
import SearchInput from './components/SearchInput';
import ProductTypeDropdown from './components/ProductTypeDropdown';
import AvailabilityFilter from './components/AvailabilityFilter';
import { useFilterPanel } from './hooks/useFilterPanel';

const FilterPanel = ({ onFilterChange }) => {
  const {
    searchTerm,
    productType,
    availability,
    handleSearchTermChange,
    handleProductTypeChange,
    handleAvailabilityChange,
    getFilterValues
  } = useFilterPanel();

  // Notify parent component of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(getFilterValues());
    }
  }, [searchTerm, productType, availability, onFilterChange, getFilterValues]);

  // Placeholder options for ProductTypeDropdown - these should ideally come from an API or context
  const productTypeOptions = [
    { value: 'type1', label: 'Rodzaj 1' },
    { value: 'type2', label: 'Rodzaj 2' },
    { value: 'type3', label: 'Rodzaj 3' },
  ];

  return (
    <div className={styles.filterPanelContainer}>
      <div className={styles.filterItem}>
        <SearchInput 
          value={searchTerm} 
          onChange={handleSearchTermChange} 
          placeholder="Szukaj po nazwie lub EAN..."
        />
      </div>
      <div className={styles.filterItem}>
        <ProductTypeDropdown 
          value={productType} 
          onChange={handleProductTypeChange} 
          options={productTypeOptions} 
          placeholder="Wszystkie rodzaje"
        />
      </div>
      <div className={styles.filterItem}>
        <AvailabilityFilter 
          selectedValue={availability} 
          onChange={handleAvailabilityChange} 
        />
      </div>
    </div>
  );
};

export default FilterPanel;

