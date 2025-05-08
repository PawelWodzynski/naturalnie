import React, { useState, useEffect } from 'react';
import styles from './QuantityControlModal.module.css';

const QuantityControlModal = ({ initialQuantity = 1, onQuantityChange }) => {
  const [currentQuantity, setCurrentQuantity] = useState(initialQuantity);

  useEffect(() => {
    setCurrentQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleDecrement = () => {
    const newQuantity = Math.max(1, currentQuantity - 1);
    setCurrentQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrement = () => {
    const newQuantity = currentQuantity + 1;
    setCurrentQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  // Optional: Allow direct input
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setCurrentQuantity(value);
      if (onQuantityChange) {
        onQuantityChange(value);
      }
    } else if (event.target.value === '') {
        // Allow clearing the input, treat as 1 or handle as needed
        setCurrentQuantity(1); // Or some other default/validation
         if (onQuantityChange) {
            onQuantityChange(1);
        }
    }
  };

  return (
    <div className={styles.quantityControlContainer}>
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <input 
        type="number" 
        value={currentQuantity} 
        onChange={handleInputChange} 
        className={styles.quantityInput} 
        min="1"
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
    </div>
  );
};

export default QuantityControlModal;

