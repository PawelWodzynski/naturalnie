import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal';
import ProductsTable from './components/ProductsTable';
import { NadkategorieProvider } from '../../context/NadkategorieContext'; // Import the Nadkategorie provider
import { ProductQuantityProvider } from '../../context/ProductQuantityContext'; // Import the ProductQuantity provider

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
      <ProductQuantityProvider> { /* Wrap with ProductQuantityProvider */ }
        <div className={styles.shopPageContainer}>
          <ShopNavbar 
            onAddProductClick={handleOpenModal} 
            onCategoryClick={handleCategoryChange} 
          />
          <main className={styles.shopContent}>
            <h1>Witaj w sklepie!</h1>
            <ProductsTable selectedNadKategoriaId={selectedNadKategoriaId} />
          </main>
          <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
      </ProductQuantityProvider>
    </NadkategorieProvider>
  );
};

export default ShopPage;

