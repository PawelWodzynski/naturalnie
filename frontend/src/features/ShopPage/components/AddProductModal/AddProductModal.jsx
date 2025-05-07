import React, { useState } from 'react';
import styles from './AddProductModal.module.css';
import ProductForm from './components/ProductForm';

const AddProductModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2>Dodaj nowy produkt</h2>
        <ProductForm onClose={onClose} />
      </div>
    </div>
  );
};

export default AddProductModal;
