import React from 'react';
import styles from './ProductDetailItem.module.css';

const ProductDetailItem = ({ label, value, className }) => {
  if (value === null || value === undefined || value === '') {
    return null; // Don't render if value is not meaningful
  }
  
  // Combine default styles with any additional className
  const valueClassName = className 
    ? `${styles.detailValue} ${className}`
    : styles.detailValue;
    
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}:</span>
      <span className={valueClassName}>{String(value)}</span>
    </div>
  );
};

export default ProductDetailItem;
