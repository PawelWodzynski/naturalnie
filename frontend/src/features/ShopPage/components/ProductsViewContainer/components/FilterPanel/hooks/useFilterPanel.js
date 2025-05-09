import { useState, useCallback } from 'react';

export const useFilterPanel = (initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [productType, setProductType] = useState(initialFilters.productType || '');
  const [availability, setAvailability] = useState(initialFilters.availability || ''); // e.g., '', 'true', 'false'

  const handleSearchTermChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const handleProductTypeChange = useCallback((newProductType) => {
    setProductType(newProductType);
  }, []);

  const handleAvailabilityChange = useCallback((newAvailability) => {
    setAvailability(newAvailability);
  }, []);

  // This function can be called by a parent to get all current filter values
  // or the parent can consume individual states if preferred.
  const getFilterValues = useCallback(() => ({
    searchTerm,
    productType,
    availability,
  }), [searchTerm, productType, availability]);

  // Expose state and handlers
  return {
    searchTerm,
    productType,
    availability,
    handleSearchTermChange,
    handleProductTypeChange,
    handleAvailabilityChange,
    getFilterValues,
    // Individual setters can also be returned if direct setting from parent is needed
    // setSearchTerm, 
    // setProductType,
    // setAvailability
  };
};

