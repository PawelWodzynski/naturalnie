import React, { useState, useEffect } from 'react';
import styles from './QuantityControl.module.css';
import { useProductQuantity } from '../../../../../../../../context/ProductQuantityContext';

const QuantityControl = ({ productId }) => {
  const { getStoredQuantity, updateStoredQuantity, commitFinalQuantity, incrementQuantity, decrementQuantity } = useProductQuantity();
  const quantityFromContext = getStoredQuantity(productId);

  const [inputValue, setInputValue] = useState(quantityFromContext.toString());

  useEffect(() => {
    setInputValue(quantityFromContext.toString());
  }, [quantityFromContext]);

  const handleDecrement = (event) => {
    event.stopPropagation();
    // The button should be disabled if quantity is 1, so this check is more for safety
    if (quantityFromContext > 1) {
      decrementQuantity(productId);
    }
  };

  const handleIncrement = (event) => {
    event.stopPropagation();
    incrementQuantity(productId);
  };

  const handleInputChange = (event) => {
    event.stopPropagation();
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

  const handleInputBlur = (event) => {
    event.stopPropagation();
    commitFinalQuantity(productId);
  };

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    commitFinalQuantity(productId);
    const finalQuantityForCart = getStoredQuantity(productId);
    console.log(`Dodano do koszyka: Produkt ID ${productId}, Ilość: ${finalQuantityForCart}`);
  };

  // Determine if the decrement button should be disabled
  const isDecrementDisabled = quantityFromContext <= 1;

  return (
    <div className={styles.quantityControlContainer} onClick={handleContainerClick}>
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
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
    </div>
  );
};

export default QuantityControl;

