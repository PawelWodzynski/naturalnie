import React from 'react';
import styles from './TopNavigationPanel.module.css';
import NavigationButton from './components/NavigationButton';

const TopNavigationPanel = () => {
  // Placeholder actions for buttons
  const handleProduktyClick = () => {
    console.log('Produkty button clicked');
    // Potentially set a view state or navigate
  };

  const handleFormularzClick = () => {
    console.log('Formularz zamówienia button clicked');
    // Potentially set a view state or navigate
  };

  const handlePotwierdzenieClick = () => {
    console.log('Potwierdzenie button clicked');
    // Potentially set a view state or navigate
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

