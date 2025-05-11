import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal';
import TopNavigationPanel from './components/TopNavigationPanel';
import ProductsViewContainer from './components/ProductsViewContainer';
import PaymentConfirmationView from './components/PaymentConfirmationView';
import OrdersView from './components/OrdersView';
import { NadkategorieProvider } from '../../context/NadkategorieContext';
import { ProductQuantityProvider } from '../../context/ProductQuantityContext';
import { CartProvider } from '../../context/CartContext';
import { AddressProvider } from '../../context/AddressContext';
import { DeliveryDateProvider } from '../../context/DeliveryDateContext';
import { useCart } from '../../context/CartContext';
import { useDeliveryDate } from '../../context/DeliveryDateContext';

// Component to handle validation before showing payment view
const ValidationWrapper = ({ children, currentView, setCurrentView }) => {
  const { cartItems } = useCart();
  const { isDateSelected } = useDeliveryDate();
  
  const [validationError, setValidationError] = useState('');
  
  // Function to validate before showing payment view
  const validateAndShowPaymentView = () => {
    // Clear any previous error
    setValidationError('');
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      setValidationError('Nie można przejść do potwierdzenia zamówienia, koszyk jest pusty.');
      return false;
    }
    
    // Check if delivery date is selected
    if (!isDateSelected) {
      setValidationError('Nie można przejść do potwierdzenia zamówienia, data nie została wybrana.');
      return false;
    }
    
    // All validations passed
    setCurrentView('payment');
    return true;
  };
  
  // Clone children with additional props
  return React.cloneElement(children, { 
    validationError,
    validateAndShowPaymentView,
    currentView,
    setCurrentView
  });
};

const ShopPageContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNadKategoriaId, setSelectedNadKategoriaId] = useState(null);
  const [currentView, setCurrentView] = useState('products'); // 'products', 'cart', 'payment', or 'orders'
  const [validationError, setValidationError] = useState('');

  const { cartItems } = useCart();
  const { isDateSelected } = useDeliveryDate();

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
  
  const handleShowOrdersView = () => {
    setCurrentView('orders');
    setValidationError('');
  };

  const toggleCartView = () => {
    setCurrentView(currentView === 'cart' ? 'products' : 'cart');
    // Clear any validation errors when changing views
    setValidationError('');
  };

  const handleShowProductsView = () => {
    setCurrentView('products');
    // Clear any validation errors when changing views
    setValidationError('');
  };

  const handleShowPaymentView = () => {
    // Validate before showing payment view
    if (cartItems.length === 0) {
      setValidationError('Nie można przejść do potwierdzenia zamówienia, koszyk jest pusty.');
      return;
    }
    
    if (!isDateSelected) {
      setValidationError('Nie można przejść do potwierdzenia zamówienia, data nie została wybrana.');
      return;
    }
    
    // All validations passed
    setCurrentView('payment');
    setValidationError('');
    console.log('Showing payment confirmation view');
  };

  const handlePaymentConfirm = (paymentMethod) => {
    console.log('Payment confirmed with method:', paymentMethod);
    // Here you would typically process the order
    // For now, we'll just go back to the products view
    setCurrentView('products');
  };

  const handleShowConfirmationView = () => {
    // Validate before showing payment view
    if (cartItems.length === 0) {
      setValidationError('Nie można przejść do potwierdzenia zamówienia, koszyk jest pusty.');
      return;
    }
    
    if (!isDateSelected) {
      setValidationError('Nie można przejść do potwierdzenia zamówienia, data nie została wybrana.');
      return;
    }
    
    // All validations passed
    setCurrentView('payment');
    setValidationError('');
    console.log('Showing payment confirmation view from navigation panel');
  };

  return (
    <div className={styles.shopPageContainer}>
      <ShopNavbar 
        onAddProductClick={handleOpenModal} 
        onCategoryClick={handleCategoryChange}
        onShowOrdersClick={handleShowOrdersView}
      />
      <main className={styles.shopContent}>
        {/* Pass all handlers to TopNavigationPanel */}
        <TopNavigationPanel 
          onToggleCartView={toggleCartView} 
          onShowProductsView={handleShowProductsView}
          onShowConfirmationView={handleShowConfirmationView}
          currentView={currentView}
        />
        
        {validationError && (
          <div className={styles.validationError}>
            {validationError}
          </div>
        )}
        
        {currentView === 'payment' ? (
          <PaymentConfirmationView onConfirm={handlePaymentConfirm} />
        ) : currentView === 'orders' ? (
          <OrdersView />
        ) : (
          <ProductsViewContainer 
            selectedNadKategoriaId={selectedNadKategoriaId} 
            showCartView={currentView === 'cart'} 
            onToggleCartView={toggleCartView}
            onShowPaymentView={handleShowPaymentView}
            validationError={validationError}
          />
        )}
      </main>
      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

const ShopPage = () => {
  return (
    <NadkategorieProvider>
      <ProductQuantityProvider>
        <CartProvider>
          <AddressProvider>
            <DeliveryDateProvider>
              <ShopPageContent />
            </DeliveryDateProvider>
          </AddressProvider>
        </CartProvider>
      </ProductQuantityProvider>
    </NadkategorieProvider>
  );
};

export default ShopPage;
