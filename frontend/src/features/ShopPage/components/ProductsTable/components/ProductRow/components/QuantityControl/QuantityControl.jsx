import React, { useState, useEffect } from 'react';
import styles from './QuantityControl.module.css';
import { useProductQuantity } from '../../../../../../../../context/ProductQuantityContext';

const QuantityControl = ({ productId }) => {
  // Use the new context functions
  const { getStoredQuantity, updateStoredQuantity, commitFinalQuantity, incrementQuantity, decrementQuantity } = useProductQuantity();
  const quantityFromContext = getStoredQuantity(productId);

  const [inputValue, setInputValue] = useState(quantityFromContext.toString());

  useEffect(() => {
    setInputValue(quantityFromContext.toString());
  }, [quantityFromContext]);

  const handleDecrement = (event) => {
    event.stopPropagation();
    decrementQuantity(productId); // This will now allow 0 temporarily via updateStoredQuantity
  };

  const handleIncrement = (event) => {
    event.stopPropagation();
    incrementQuantity(productId);
  };

  const handleInputChange = (event) => {
    event.stopPropagation();
    const currentDisplayValue = event.target.value;
    setInputValue(currentDisplayValue);

    // Allow empty string or numbers to be typed
    if (currentDisplayValue === "") {
      // If user clears the field, we don't update context immediately.
      // Validation will happen onBlur.
    } else {
      const numericValue = parseInt(currentDisplayValue, 10);
      if (!isNaN(numericValue)) {
        // Update context with the potentially 0 or positive value
        updateStoredQuantity(productId, numericValue);
      } else {
        // If input is not a number (e.g. "abc"), do nothing or reset inputValue
        // For now, let it be, blur will handle it
      }
    }
  };

  const handleInputBlur = (event) => {
    event.stopPropagation();
    // On blur, commit the final quantity. Context will handle setting to 1 if it's 0.
    commitFinalQuantity(productId);
    // The useEffect will then sync inputValue with the potentially corrected context value.
  };

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    // Commit quantity before adding to cart to ensure it's valid (e.g., not 0)
    commitFinalQuantity(productId);
    // After commit, get the latest quantity for the log/action
    // Note: This might need a slight delay or a way to get the committed value if commit is async
    // For simplicity, we assume commitFinalQuantity updates the context synchronously for getStoredQuantity
    const finalQuantityForCart = getStoredQuantity(productId); 
    console.log(`Dodano do koszyka: Produkt ID ${productId}, Ilość: ${finalQuantityForCart}`);
  };

  return (
    <div className={styles.quantityControlContainer} onClick={handleContainerClick}>
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={styles.quantityInput}
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
    </div>
  );
};

export default QuantityControl;

