import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal';
// import ProductsTable from './components/ProductsTable'; // Will be rendered by ProductsViewContainer
import ProductsViewContainer from './components/ProductsViewContainer'; // Import the new container
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
            {/* Remove the h1 title if the filter panel replaces it or if it's part of ProductsViewContainer design */}
            {/* <h1>Witaj w sklepie!</h1> */}
            <ProductsViewContainer selectedNadKategoriaId={selectedNadKategoriaId} />
          </main>
          <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
      </ProductQuantityProvider>
    </NadkategorieProvider>
  );
};

export default ShopPage;

