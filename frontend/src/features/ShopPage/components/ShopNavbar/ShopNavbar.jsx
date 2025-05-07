import React from 'react';
import styles from './ShopNavbar.module.css';
import LogoutButton from './components/LogoutButton';
import AddProductButton from './components/AddProductButton';

const ShopNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoPlaceholder}>Sklep Online</div>
      <div className={styles.actionsContainer}>
        <AddProductButton />
        <LogoutButton />
      </div>
    </nav>
  );
};

export default ShopNavbar;
