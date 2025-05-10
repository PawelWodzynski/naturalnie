import React from 'react';
import styles from './TopNavigationPanel.module.css';
import NavigationButton from './components/NavigationButton';

// onToggleCartView and onShowProductsView props are now passed from ShopPage
const TopNavigationPanel = ({ onToggleCartView, onShowProductsView }) => {
  // "Produkty" button now calls onShowProductsView to ensure product table is shown
  const handleProduktyClick = () => {
    console.log('Produkty button clicked, ensuring product view is active.');
    if (onShowProductsView) {
      onShowProductsView();
    }
  };

  // "Formularz zamówienia" button uses onToggleCartView to show/hide cart/order view
  const handleFormularzClick = () => {
    console.log('Formularz zamówienia button clicked, toggling cart/order view.');
    if (onToggleCartView) {
      onToggleCartView();
    }
  };

  const handlePotwierdzenieClick = () => {
    console.log('Potwierdzenie button clicked');
    // This button might also interact with the view state or navigate elsewhere.
    // For now, it could also ensure the product view is active if it's a step after cart/order.
    // Or, it might be related to a different view entirely.
  };

  return (
    <div className={styles.topNavigationPanelContainer}>
      <NavigationButton text="Produkty" onClick={handleProduktyClick} />
      <NavigationButton text="Formularz zamówienia" onClick={handleFormularzClick} />
      <NavigationButton text="Potwierdzenie" onClick={handlePotwierdzenieClick} />
    </div>
  );
};

export default TopNavigationPanel;

