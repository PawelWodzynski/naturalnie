import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal';
import TopNavigationPanel from './components/TopNavigationPanel';
import ProductsViewContainer from './components/ProductsViewContainer';
import PaymentConfirmationView from './components/PaymentConfirmationView';
import { NadkategorieProvider } from '../../context/NadkategorieContext';
import { ProductQuantityProvider } from '../../context/ProductQuantityContext';
import { CartProvider } from '../../context/CartContext';
import { AddressProvider } from '../../context/AddressContext';

const ShopPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNadKategoriaId, setSelectedNadKategoriaId] = useState(null);
  const [currentView, setCurrentView] = useState('products'); // 'products', 'cart', or 'payment'

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (nadKategoriaId) => {
    console.log("ShopPage - NadKategoria ID selected:", nadKategoriaId);
    setSelectedNadKategoriaId(nadKategoriaId);
    setCurrentView('products'); // Always show products table when category changes
  };

  const toggleCartView = () => {
    setCurrentView(currentView === 'cart' ? 'products' : 'cart');
  };

  const handleShowProductsView = () => {
    setCurrentView('products');
  };

  const handleShowPaymentView = () => {
    setCurrentView('payment');
    console.log('Showing payment confirmation view');
  };

  const handlePaymentConfirm = (paymentMethod) => {
    console.log('Payment confirmed with method:', paymentMethod);
    // Here you would typically process the order
    // For now, we'll just go back to the products view
    setCurrentView('products');
  };

  const handleShowConfirmationView = () => {
    setCurrentView('payment');
    console.log('Showing payment confirmation view from navigation panel');
  };

  return (
    <NadkategorieProvider>
      <ProductQuantityProvider>
        <CartProvider>
          <AddressProvider>
            <div className={styles.shopPageContainer}>
              <ShopNavbar 
                onAddProductClick={handleOpenModal} 
                onCategoryClick={handleCategoryChange} 
              />
              <main className={styles.shopContent}>
                {/* Pass all handlers to TopNavigationPanel */}
                <TopNavigationPanel 
                  onToggleCartView={toggleCartView} 
                  onShowProductsView={handleShowProductsView}
                  onShowConfirmationView={handleShowConfirmationView}
                  currentView={currentView}
                />
                
                {currentView === 'payment' ? (
                  <PaymentConfirmationView onConfirm={handlePaymentConfirm} />
                ) : (
                  <ProductsViewContainer 
                    selectedNadKategoriaId={selectedNadKategoriaId} 
                    showCartView={currentView === 'cart'} 
                    onToggleCartView={toggleCartView}
                    onShowPaymentView={handleShowPaymentView}
                  />
                )}
              </main>
              <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
            </div>
          </AddressProvider>
        </CartProvider>
      </ProductQuantityProvider>
    </NadkategorieProvider>
  );
};

export default ShopPage;
