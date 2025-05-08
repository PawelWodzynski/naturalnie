import { useState, useCallback } from 'react';

const useProductModals = (handleDropdownChangeCallback, dropdownRefs) => {
  const [activeAddOptionModal, setActiveAddOptionModal] = useState({ type: null, isOpen: false });

  const handleOpenAddOptionModal = useCallback((entityType) => {
    setActiveAddOptionModal({ type: entityType, isOpen: true });
  }, []);

  const handleCloseAddOptionModal = useCallback(() => {
    setActiveAddOptionModal({ type: null, isOpen: false });
  }, []);

  const handleOptionSuccessfullyAdded = useCallback((newlyAddedOption, entityType) => {
    if (newlyAddedOption && entityType) {
      if (typeof handleDropdownChangeCallback === 'function') {
        handleDropdownChangeCallback(entityType, newlyAddedOption);
      } else {
        console.error("handleDropdownChangeCallback is not a function in useProductModals");
      }

      if (dropdownRefs && dropdownRefs[entityType]) {
        const dropdownRef = dropdownRefs[entityType];
        if (dropdownRef.current && typeof dropdownRef.current.refreshAndSelect === 'function') {
          dropdownRef.current.refreshAndSelect(newlyAddedOption);
        } else {
          console.warn(`Dropdown ref or refreshAndSelect method not found for ${entityType}`);
        }
      } else {
        console.warn(`dropdownRefs or dropdownRefs[${entityType}] is not available in useProductModals`);
      }
    }
    handleCloseAddOptionModal();
  }, [handleDropdownChangeCallback, dropdownRefs, handleCloseAddOptionModal]);

  return {
    activeAddOptionModal,
    // setActiveAddOptionModal, // Not exposing setter directly unless needed by parent
    handleOpenAddOptionModal,
    handleCloseAddOptionModal,
    handleOptionSuccessfullyAdded,
  };
};

export default useProductModals;

