import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal';
import TopNavigationPanel from './components/TopNavigationPanel';
import ProductsViewContainer from './components/ProductsViewContainer';
import { NadkategorieProvider } from '../../context/NadkategorieContext';
import { ProductQuantityProvider } from '../../context/ProductQuantityContext';
import { CartProvider } from '../../context/CartContext'; // Import CartProvider

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
        <CartProvider> {/* Wrap with CartProvider */}
          <div className={styles.shopPageContainer}>
            <ShopNavbar 
              onAddProductClick={handleOpenModal} 
              onCategoryClick={handleCategoryChange} 
            />
            <main className={styles.shopContent}>
              <TopNavigationPanel />
              <ProductsViewContainer selectedNadKategoriaId={selectedNadKategoriaId} />
            </main>
            <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </div>
        </CartProvider>
      </ProductQuantityProvider>
    </NadkategorieProvider>
  );
};

export default ShopPage;
