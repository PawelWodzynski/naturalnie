import React from 'react';
import styles from './ShopNavbar.module.css';
import LogoutButton from './components/LogoutButton';
import AddProductButton from './components/AddProductButton';

// Accept onAddProductClick as a prop
const ShopNavbar = ({ onAddProductClick }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoPlaceholder}>Sklep Online</div>
      <div className={styles.actionsContainer}>
        {/* Pass onAddProductClick to AddProductButton */}
        <AddProductButton onClick={onAddProductClick} />
        <LogoutButton />
      </div>
    </nav>
  );
};

export default ShopNavbar;
