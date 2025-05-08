import React, { useState, useEffect } from 'react';
import styles from './ShopNavbar.module.css';
import LogoutButton from './components/LogoutButton';
import AddProductButton from './components/AddProductButton';
import NadkategorieBar from './components/NadkategorieBar'; // Import NadkategorieBar

const ShopNavbar = ({ onAddProductClick }) => {
  const [apiToken, setApiToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setApiToken(token);
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoPlaceholder}>Sklep Online</div>
      <div className={styles.nadkategorieBarWrapper}>
        {apiToken && <NadkategorieBar apiToken={apiToken} />}
      </div>
      <div className={styles.actionsContainer}>
        <AddProductButton onClick={onAddProductClick} />
        <LogoutButton />
      </div>
    </nav>
  );
};

export default ShopNavbar;

