import { useState, useCallback } from 'react';
import { useNadkategorie } from '../../../context/NadkategorieContext'; // Import the context hook

const useProductModals = (handleDropdownChangeCallback, dropdownRefs) => {
  const [activeAddOptionModal, setActiveAddOptionModal] = useState({ type: null, isOpen: false });
  const { triggerRefresh: triggerNadkategorieRefresh } = useNadkategorie(); // Get the trigger function

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

      // If a nadkategoria was added, trigger the refresh for NadkategorieBar
      if (entityType === 'nadKategoria') {
        triggerNadkategorieRefresh();
        console.log("Nadkategoria added, refresh triggered from useProductModals.");
      }
    }
    handleCloseAddOptionModal();
  }, [handleDropdownChangeCallback, dropdownRefs, handleCloseAddOptionModal, triggerNadkategorieRefresh]);

  return {
    activeAddOptionModal,
    handleOpenAddOptionModal,
    handleCloseAddOptionModal,
    handleOptionSuccessfullyAdded,
  };
};

export default useProductModals;

