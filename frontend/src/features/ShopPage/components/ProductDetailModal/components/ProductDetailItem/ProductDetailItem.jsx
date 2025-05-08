import React from 'react';
import styles from './ProductDetailItem.module.css';

const ProductDetailItem = ({ label, value }) => {
  if (value === null || value === undefined || value === '') {
    return null; // Don't render if value is not meaningful
  }
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}:</span>
      <span className={styles.detailValue}>{String(value)}</span>
    </div>
  );
};

export default ProductDetailItem;

