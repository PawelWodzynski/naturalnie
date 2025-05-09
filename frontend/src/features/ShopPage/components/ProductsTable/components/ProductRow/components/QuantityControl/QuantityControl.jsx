import React, { useState, useEffect } from 'react';
import styles from './QuantityControl.module.css';
import { useProductQuantity } from '../../../../../../../../context/ProductQuantityContext';
import { useCart } from '../../../../../../../../context/CartContext'; // Import useCart

// Accept product object as a prop instead of just productId
const QuantityControl = ({ product }) => { 
  const { getStoredQuantity, updateStoredQuantity, commitFinalQuantity, incrementQuantity, decrementQuantity } = useProductQuantity();
  const { addToCart } = useCart(); // Get addToCart from CartContext

  // Use product.id for quantity management
  const quantityFromContext = getStoredQuantity(product.id);

  const [inputValue, setInputValue] = useState(quantityFromContext.toString());

  useEffect(() => {
    setInputValue(quantityFromContext.toString());
  }, [quantityFromContext, product.id]); // Add product.id to dependencies

  const handleDecrement = (event) => {
    event.stopPropagation();
    if (quantityFromContext > 1) {
      decrementQuantity(product.id);
    }
  };

  const handleIncrement = (event) => {
    event.stopPropagation();
    incrementQuantity(product.id);
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
        updateStoredQuantity(product.id, numericValue);
      }
    }
  };

  const handleInputBlur = (event) => {
    event.stopPropagation();
    commitFinalQuantity(product.id);
  };

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    commitFinalQuantity(product.id); // Ensure the latest quantity is committed
    const finalQuantityForCart = getStoredQuantity(product.id);
    
    if (finalQuantityForCart > 0) {
      // Call addToCart with the product details and quantity
      addToCart(product, finalQuantityForCart);
      console.log(`Dodano do koszyka: Produkt ID ${product.id} (${product.nazwa}), Cena: ${product.cena}, Ilość: ${finalQuantityForCart}`);
    } else {
      console.log(`Nie dodano do koszyka: Produkt ID ${product.id}, Ilość musi być większa od 0.`);
    }
  };

  const isDecrementDisabled = quantityFromContext <= 1;

  return (
    <div className={styles.quantityControlContainer} onClick={handleContainerClick}>
      <button 
        onClick={handleDecrement} 
        className={styles.quantityButton} 
        disabled={isDecrementDisabled}
      >
        -
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={styles.quantityInput}
        min="1" // It's good practice to set min for number input used for quantity
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
    </div>
  );
};

export default QuantityControl;
