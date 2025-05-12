import React from 'react';
import styles from './AddProductModal.module.css';
import ProductForm from './components/ProductForm';

const AddProductModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Dodaj nowy produkt</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <ProductForm onClose={onClose} />
      </div>
    </div>
  );
};

export default AddProductModal;
