import React from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';

const ShopPage = () => {
  return (
    <div className={styles.shopPageContainer}>
      <ShopNavbar />
      <main className={styles.shopContent}>
        <h1>Witaj w sklepie!</h1>
      </main>
    </div>
  );
};

export default ShopPage;
