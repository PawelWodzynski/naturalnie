import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal';
import TopNavigationPanel from './components/TopNavigationPanel';
import ProductsViewContainer from './components/ProductsViewContainer';
import { NadkategorieProvider } from '../../context/NadkategorieContext';
import { ProductQuantityProvider } from '../../context/ProductQuantityContext';
import { CartProvider } from '../../context/CartContext';

const ShopPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNadKategoriaId, setSelectedNadKategoriaId] = useState(null);
  const [showCartView, setShowCartView] = useState(false); // True for CartView, False for ProductsTable

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (nadKategoriaId) => {
    console.log("ShopPage - NadKategoria ID selected:", nadKategoriaId);
    setSelectedNadKategoriaId(nadKategoriaId);
    setShowCartView(false); // Always show products table when category changes
  };

  const toggleCartView = () => {
    setShowCartView(prevState => !prevState);
  };

  // New handler to explicitly show ProductsTable (and thus FilterPanel)
  const handleShowProductsView = () => {
    setShowCartView(false);
  };

  return (
    <NadkategorieProvider>
      <ProductQuantityProvider>
        <CartProvider>
          <div className={styles.shopPageContainer}>
            <ShopNavbar 
              onAddProductClick={handleOpenModal} 
              onCategoryClick={handleCategoryChange} 
            />
            <main className={styles.shopContent}>
              {/* Pass both handlers to TopNavigationPanel */}
              <TopNavigationPanel 
                onToggleCartView={toggleCartView} 
                onShowProductsView={handleShowProductsView} 
              />
              <ProductsViewContainer 
                selectedNadKategoriaId={selectedNadKategoriaId} 
                showCartView={showCartView} 
                onToggleCartView={toggleCartView} 
              />
            </main>
            <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </div>
        </CartProvider>
      </ProductQuantityProvider>
    </NadkategorieProvider>
  );
};

export default ShopPage;

