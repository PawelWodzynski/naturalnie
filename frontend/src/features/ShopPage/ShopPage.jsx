import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal';
import TopNavigationPanel from './components/TopNavigationPanel'; // Import the new panel
import ProductsViewContainer from './components/ProductsViewContainer';
import { NadkategorieProvider } from '../../context/NadkategorieContext';
import { ProductQuantityProvider } from '../../context/ProductQuantityContext';

const ShopPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNadKategoriaId, setSelectedNadKategoriaId] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (nadKategoriaId) => {
    console.log("ShopPage - NadKategoria ID selected:", nadKategoriaId);
    setSelectedNadKategoriaId(nadKategoriaId);
  };

  return (
    <NadkategorieProvider>
      <ProductQuantityProvider>
        <div className={styles.shopPageContainer}>
          <ShopNavbar 
            onAddProductClick={handleOpenModal} 
            onCategoryClick={handleCategoryChange} 
          />
          <main className={styles.shopContent}>
            <TopNavigationPanel /> {/* Add the new navigation panel here */}
            <ProductsViewContainer selectedNadKategoriaId={selectedNadKategoriaId} />
          </main>
          <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
      </ProductQuantityProvider>
    </NadkategorieProvider>
  );
};

export default ShopPage;

