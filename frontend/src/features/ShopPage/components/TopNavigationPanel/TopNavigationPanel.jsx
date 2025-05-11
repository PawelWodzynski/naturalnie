import React from 'react';
import styles from './TopNavigationPanel.module.css';
import NavigationButton from './components/NavigationButton';

const TopNavigationPanel = ({ 
  onToggleCartView, 
  onShowProductsView, 
  onShowConfirmationView,
  currentView 
}) => {
  // "Produkty" button shows the products view
  const handleProduktyClick = () => {
    console.log('Produkty button clicked, ensuring product view is active.');
    if (onShowProductsView) {
      onShowProductsView();
    }
  };

  // "Formularz zamówienia" button toggles the cart/order view
  const handleFormularzClick = () => {
    console.log('Formularz zamówienia button clicked, toggling cart/order view.');
    if (onToggleCartView) {
      onToggleCartView();
    }
  };

  // "Potwierdzenie" button shows the payment confirmation view
  const handlePotwierdzenieClick = () => {
    console.log('Potwierdzenie button clicked, showing payment confirmation view.');
    if (onShowConfirmationView) {
      onShowConfirmationView();
    }
  };

  return (
    <div className={styles.topNavigationPanelContainer}>
      <NavigationButton 
        text="Produkty" 
        onClick={handleProduktyClick} 
        active={currentView === 'products'}
      />
      <NavigationButton 
        text="Formularz zamówienia" 
        onClick={handleFormularzClick} 
        active={currentView === 'cart'}
      />
      <NavigationButton 
        text="Potwierdzenie" 
        onClick={handlePotwierdzenieClick} 
        active={currentView === 'payment'}
      />
    </div>
  );
};

export default TopNavigationPanel;
