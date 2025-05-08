import React, { useState } from 'react';
import styles from './ShopPage.module.css';
import ShopNavbar from './components/ShopNavbar';
import AddProductModal from './components/AddProductModal'; // Import the modal
import ProductsTable from './components/ProductsTable'; // Added import for ProductsTable

const ShopPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNadKategoriaId, setSelectedNadKategoriaId] = useState(null); // State for selected category ID

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handler for when a category is clicked in the navbar
  const handleCategoryChange = (nadKategoriaId) => {
    console.log("ShopPage - NadKategoria ID selected:", nadKategoriaId);
    setSelectedNadKategoriaId(nadKategoriaId);
    // ProductsTable will re-fetch data based on this new ID via props
  };

  return (
    <div className={styles.shopPageContainer}>
      {/* Pass handleCategoryChange to ShopNavbar */}
      <ShopNavbar 
        onAddProductClick={handleOpenModal} 
        onCategoryClick={handleCategoryChange} 
      />
      <main className={styles.shopContent}>
        <h1>Witaj w sklepie!</h1>
        {/* Pass selectedNadKategoriaId to ProductsTable */}
        <ProductsTable selectedNadKategoriaId={selectedNadKategoriaId} />
      </main>
      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ShopPage;
