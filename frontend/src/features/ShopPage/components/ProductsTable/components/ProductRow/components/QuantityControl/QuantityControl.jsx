import React, { useState, useEffect } from 'react';
import styles from './QuantityControl.module.css';
import { useProductQuantity } from '../../../../../../../../context/ProductQuantityContext';

const QuantityControl = ({ productId }) => {
  const { getQuantity, incrementQuantity, decrementQuantity, updateQuantity } = useProductQuantity();
  const quantityFromContext = getQuantity(productId);

  const [inputValue, setInputValue] = useState(quantityFromContext.toString());

  // Sync inputValue with context quantity if it changes from outside (e.g. +/- buttons)
  useEffect(() => {
    setInputValue(quantityFromContext.toString());
  }, [quantityFromContext]);

  const handleDecrement = (event) => {
    event.stopPropagation();
    decrementQuantity(productId);
  };

  const handleIncrement = (event) => {
    event.stopPropagation();
    incrementQuantity(productId);
  };

  const handleInputChange = (event) => {
    event.stopPropagation();
    const currentDisplayValue = event.target.value;
    setInputValue(currentDisplayValue); // Allow any input for typing (e.g. empty, "0")

    // If user types a valid number, update context immediately
    // Otherwise, validation will happen onBlur
    const numericValue = parseInt(currentDisplayValue, 10);
    if (!isNaN(numericValue) && numericValue >= 1) {
      updateQuantity(productId, numericValue);
    }
  };

  const handleInputBlur = (event) => {
    event.stopPropagation();
    const finalDisplayValue = inputValue; // Use state inputValue as source of truth for blur
    const numericValue = parseInt(finalDisplayValue, 10);

    if (finalDisplayValue === "" || isNaN(numericValue) || numericValue < 1) {
      updateQuantity(productId, 1); // This updates context, then useEffect updates inputValue to "1"
    } else {
      // It's a valid number (e.g. user typed "20", or "05" which is 5)
      // Ensure context has the clean numeric value and inputValue reflects it (e.g. remove leading zeros)
      if (quantityFromContext !== numericValue) {
         updateQuantity(productId, numericValue);
      } else {
        // If context is already correct, but inputValue might be e.g. "05"
        setInputValue(numericValue.toString());
      }
    }
  };

  const handleContainerClick = (event) => {
    event.stopPropagation(); // Prevent row click when interacting with quantity controls
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    console.log(`Dodano do koszyka: Produkt ID ${productId}, Ilość: ${quantityFromContext}`);
  };

  return (
    <div className={styles.quantityControlContainer} onClick={handleContainerClick}>
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <input
        type="number" // Kept for semantic reasons and potential mobile numeric keyboard
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur} // Added onBlur handler for final validation
        className={styles.quantityInput}
        // min="1" is not strictly enforced here by browser due to custom handling but good for semantics
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
    </div>
  );
};

export default QuantityControl;

