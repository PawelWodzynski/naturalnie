import React, { useState, useEffect, useCallback } from 'react';
import styles from './ShopNavbar.module.css';
import LogoutButton from './components/LogoutButton';
import AddProductButton from './components/AddProductButton';
import NadkategorieBar from './components/NadkategorieBar';
import AddCategoryButton from './components/AddCategoryButton';
import ShowOrdersButton from './components/ShowOrdersButton';
import AddNadKategoriaModal from '../AddProductModal/components/ProductForm/components/addOptionModals/AddNadKategoriaModal';
import { useNadkategorie } from '../../../../context/NadkategorieContext';
import { addNadKategoria } from '../../../../shared/services/apiService';

const ShopNavbar = ({ onAddProductClick, onCategoryClick, onShowOrdersClick }) => {
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
    if (entityType === 'nadKategoria') {
      console.log("ShopNavbar: Nadkategoria added, triggering refresh.", newlyAddedOption);
      triggerNadkategorieRefresh();
    }
    handleCloseAddCategoryModal();
  }, [triggerNadkategorieRefresh]);

  const addNadKategoriaWithToken = useCallback(async (categoryData) => {
    if (!apiToken) {
      console.error("API token is not available for adding category.");
      return Promise.reject(new Error("Brak tokenu API"));
    }
    return addNadKategoria(categoryData, apiToken);
  }, [apiToken]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}> {/* Changed class name */}
          <div className={styles.logoPlaceholder}>Sklep Online</div>
          {apiToken && <AddCategoryButton onClick={handleOpenAddCategoryModal} />}
        </div>
        <div className={styles.nadkategorieBarWrapper}>
          {apiToken && <NadkategorieBar apiToken={apiToken} onCategoryClick={onCategoryClick} />}
        </div>
        <div className={styles.actionsContainer}>
          {apiToken && <AddProductButton onClick={onAddProductClick} />}
          {apiToken && <ShowOrdersButton onClick={onShowOrdersClick} />}
          <LogoutButton />
        </div>
      </nav>
      {isAddCategoryModalOpen && (
        <AddNadKategoriaModal
          isOpen={isAddCategoryModalOpen}
          onClose={handleCloseAddCategoryModal}
          onOptionSuccessfullyAdded={handleCategoryAdded}
          apiAddFunction={addNadKategoriaWithToken}
        />
      )}
    </>
  );
};

export default ShopNavbar;
