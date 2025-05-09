import React, { useState, useEffect } from 'react';
import styles from './QuantityControlModal.module.css';
import { useProductQuantity } from '../../../../../../context/ProductQuantityContext'; // Adjusted path

const QuantityControlModal = ({ productId }) => {
  const { getStoredQuantity, updateStoredQuantity, commitFinalQuantity, incrementQuantity, decrementQuantity } = useProductQuantity();
  
  const quantityFromContext = getStoredQuantity(productId);
  const [inputValue, setInputValue] = useState(quantityFromContext.toString());

  useEffect(() => {
    setInputValue(quantityFromContext.toString());
  }, [quantityFromContext]);

  if (!productId) {
    console.warn("QuantityControlModal: productId is undefined. Cannot initialize quantity.");
    return (
      <div className={styles.quantityControlContainer}>
        <button className={styles.quantityButton} disabled>-</button>
        <input 
          type="number" 
          value="1" 
          className={styles.quantityInput} 
          disabled
        />
        <button className={styles.quantityButton} disabled>+</button>
      </div>
    );
  }

  const handleDecrement = () => {
    // Button should be disabled if quantity is 1, so this check is more for safety
    if (quantityFromContext > 1) {
      decrementQuantity(productId);
    }
  };

  const handleIncrement = () => {
    incrementQuantity(productId);
  };

  const handleInputChange = (event) => {
    const currentDisplayValue = event.target.value;
    setInputValue(currentDisplayValue);

    if (currentDisplayValue === "") {
      // Allow empty for typing, validation on blur
    } else {
      const numericValue = parseInt(currentDisplayValue, 10);
      if (!isNaN(numericValue)) {
        updateStoredQuantity(productId, numericValue);
      }
    }
  };

  const handleInputBlur = () => {
    commitFinalQuantity(productId);
  };

  // Determine if the decrement button should be disabled
  const isDecrementDisabled = quantityFromContext <= 1;

  return (
    <div className={styles.quantityControlContainer}>
      <button 
        onClick={handleDecrement} 
        className={styles.quantityButton} 
        disabled={isDecrementDisabled} // Disable button if quantity is 1 or less
      >
        -
      </button>
      <input 
        type="number" 
        value={inputValue} 
        onChange={handleInputChange} 
        onBlur={handleInputBlur}
        className={styles.quantityInput} 
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
    </div>
  );
};

export default QuantityControlModal;

