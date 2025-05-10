import React from 'react';
import styles from './TopNavigationPanel.module.css';
import NavigationButton from './components/NavigationButton';

// onToggleCartView prop is now passed from ShopPage
const TopNavigationPanel = ({ onToggleCartView }) => {
  const handleProduktyClick = () => {
    console.log('Produkty button clicked');
    // This button might need to ensure the cart/order view is hidden
    // For now, it does nothing with the shared toggle state.
    // If "Produkty" should always show the product table, it could call onToggleCartView(false) or similar logic.
  };

  // Use the passed onToggleCartView for the "Formularz zamówienia" button
  const handleFormularzClick = () => {
    console.log('Formularz zamówienia button clicked, toggling view.');
    if (onToggleCartView) {
      onToggleCartView();
    }
  };

  const handlePotwierdzenieClick = () => {
    console.log('Potwierdzenie button clicked');
    // This button might also interact with the view state or navigate elsewhere.
  };

  return (
    <div className={styles.topNavigationPanelContainer}>
      <NavigationButton text="Produkty" onClick={handleProduktyClick} />
      {/* The "Formularz zamówienia" button now uses the shared toggle logic */}
      <NavigationButton text="Formularz zamówienia" onClick={handleFormularzClick} />
      <NavigationButton text="Potwierdzenie" onClick={handlePotwierdzenieClick} />
    </div>
  );
};

export default TopNavigationPanel;

