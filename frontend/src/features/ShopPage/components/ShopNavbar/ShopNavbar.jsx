import React, { useState, useEffect, useCallback } from 'react';
import styles from './ShopNavbar.module.css';
import LogoutButton from './components/LogoutButton';
import AddProductButton from './components/AddProductButton';
import NadkategorieBar from './components/NadkategorieBar';
import AddCategoryButton from './components/AddCategoryButton'; // Import new button
import AddNadKategoriaModal from '../AddProductModal/components/ProductForm/components/addOptionModals/AddNadKategoriaModal'; // Import modal
import { useNadkategorie } from '../../../../context/NadkategorieContext'; // Import context hook
import { addNadKategoria } from '../../../../shared/services/apiService'; // Import API function

const ShopNavbar = ({ onAddProductClick, onCategoryClick }) => {
  const [apiToken, setApiToken] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const { triggerRefresh: triggerNadkategorieRefresh } = useNadkategorie();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setApiToken(token);
    }
  }, []);

  const handleOpenAddCategoryModal = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleCloseAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const handleCategoryAdded = useCallback(async (newlyAddedOption, entityType) => {
    // newlyAddedOption is the data of the added category, entityType is 'nadKategoria'
    if (entityType === 'nadKategoria') {
      console.log("ShopNavbar: Nadkategoria added, triggering refresh.", newlyAddedOption);
      triggerNadkategorieRefresh();
    }
    handleCloseAddCategoryModal();
  }, [triggerNadkategorieRefresh]);

  // Wrapper for addNadKategoria to include the API token if needed by the service function signature
  // Assuming addNadKategoria from apiService takes (data, token) or handles token internally.
  // If addNadKategoria is defined as `async (data, token)`:
  const addNadKategoriaWithToken = useCallback(async (categoryData) => {
    if (!apiToken) {
      console.error("API token is not available for adding category.");
      // Optionally, you could throw an error or return a specific error structure
      // that AddNadKategoriaModal can handle to display a message.
      return Promise.reject(new Error("Brak tokenu API"));
    }
    return addNadKategoria(categoryData, apiToken);
  }, [apiToken]);
  
  // If addNadKategoria handles token internally (e.g., reads from localStorage),
  // then addNadKategoriaWithToken can just be `addNadKategoria`.
  // For now, let's assume it needs the token passed.

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logoAndActionsContainer}> {/* Renamed for clarity */}
          <div className={styles.logoPlaceholder}>Sklep Online</div>
          {apiToken && <AddCategoryButton onClick={handleOpenAddCategoryModal} />} {/* Show button only if logged in */}
        </div>
        <div className={styles.nadkategorieBarWrapper}>
          {apiToken && <NadkategorieBar apiToken={apiToken} onCategoryClick={onCategoryClick} />}
        </div>
        <div className={styles.actionsContainer}>
          {apiToken && <AddProductButton onClick={onAddProductClick} />} {/* Show button only if logged in */}
          <LogoutButton />
        </div>
      </nav>
      {isAddCategoryModalOpen && (
        <AddNadKategoriaModal
          isOpen={isAddCategoryModalOpen}
          onClose={handleCloseAddCategoryModal}
          onOptionSuccessfullyAdded={handleCategoryAdded} // This callback receives (newlyAddedOption, entityType)
          apiAddFunction={addNadKategoriaWithToken} // Pass the wrapped function
        />
      )}
    </>
  );
};

export default ShopNavbar;

