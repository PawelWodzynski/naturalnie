import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal'; // Import the modal
import ProductsTable from './components/ProductsTable'; // Added import for ProductsTable

const ShopPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.shopPageContainer}>
      <ShopNavbar onAddProductClick={handleOpenModal} /> {/* Pass handler to Navbar */}
      <main className={styles.shopContent}>
        <h1>Witaj w sklepie!</h1>
        <ProductsTable /> {/* Added ProductsTable component here */}
        {/* Można tu dodać listę produktów lub inną zawartość sklepu */}
      </main>
      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ShopPage;
