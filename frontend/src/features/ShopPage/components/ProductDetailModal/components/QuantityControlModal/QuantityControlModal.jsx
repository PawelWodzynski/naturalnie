import React, { useState, useEffect } from 'react';
import styles from './QuantityControlModal.module.css';

// Refactored to be a more controlled component
const QuantityControlModal = ({ productId, initialQuantity = 1, onQuantityChange }) => {
  const [currentQuantity, setCurrentQuantity] = useState(initialQuantity);

  // Update currentQuantity if initialQuantity changes (e.g., modal reopens for same product with context update)
  useEffect(() => {
    setCurrentQuantity(initialQuantity);
  }, [initialQuantity, productId]); // Add productId to ensure re-init if product changes

  if (!productId) {
    console.warn("QuantityControlModal: productId is undefined.");
    return (
      <div className={styles.quantityControlContainer}>
        <button className={styles.quantityButton} disabled>-</button>
        <input type="number" value="1" className={styles.quantityInput} disabled />
        <button className={styles.quantityButton} disabled>+</button>
      </div>
    );
  }

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      if (onQuantityChange) {
        onQuantityChange(newQuantity);
      }
    }
  };

  const handleIncrement = () => {
    const newQuantity = currentQuantity + 1;
    setCurrentQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue === "") {
      setCurrentQuantity(1); // Or some other default/minimum, or handle as temporary empty state
      if (onQuantityChange) {
        onQuantityChange(1); // Or handle differently
      }
    } else {
      const numericValue = parseInt(inputValue, 10);
      if (!isNaN(numericValue) && numericValue >= 1) {
        setCurrentQuantity(numericValue);
        if (onQuantityChange) {
          onQuantityChange(numericValue);
        }
      } else if (!isNaN(numericValue) && numericValue < 1) {
        // If user types 0 or negative, reset to 1 or handle as error
        setCurrentQuantity(1);
        if (onQuantityChange) {
          onQuantityChange(1);
        }
      }
    }
  };

  const handleInputBlur = (event) => {
    // Ensure the quantity is at least 1 on blur
    if (currentQuantity < 1) {
      setCurrentQuantity(1);
      if (onQuantityChange) {
        onQuantityChange(1);
      }
    }
    // The onQuantityChange in handleInputChange should have already updated the parent.
    // If ProductQuantityContext needs to be updated on blur, ProductDetailModal should handle it.
  };

  const isDecrementDisabled = currentQuantity <= 1;

  return (
    <div className={styles.quantityControlContainer}>
      <button 
        onClick={handleDecrement} 
        className={styles.quantityButton} 
        disabled={isDecrementDisabled}
      >
        -
      </button>
      <input 
        type="number" 
        value={currentQuantity} 
        onChange={handleInputChange}
        onBlur={handleInputBlur} // Finalize quantity on blur
        className={styles.quantityInput} 
        min="1"
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
    </div>
  );
};

export default QuantityControlModal;

