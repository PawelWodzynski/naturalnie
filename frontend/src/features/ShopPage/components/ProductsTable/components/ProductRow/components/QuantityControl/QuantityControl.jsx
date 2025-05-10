import React, { useState, useEffect } from 'react';
import styles from './QuantityControl.module.css';
import { useProductQuantity } from '../../../../../../../../context/ProductQuantityContext';
import { useCart } from '../../../../../../../../context/CartContext';

// Accept product object and source as props
const QuantityControl = ({ product, source = 'productTable' }) => { 
  const { getStoredQuantity, updateStoredQuantity, commitFinalQuantity, incrementQuantity: incrementProductQuantity, decrementQuantity: decrementProductQuantity } = useProductQuantity();
  const { addToCart, updateQuantity: updateCartItemQuantity } = useCart();

  // Determine initial quantity based on source
  const initialQuantity = source === 'cart' ? product.ilosc : getStoredQuantity(product.id);
  const [currentQuantity, setCurrentQuantity] = useState(initialQuantity);
  const [inputValue, setInputValue] = useState(initialQuantity.toString());

  useEffect(() => {
    const quantityToDisplay = source === 'cart' ? product.ilosc : getStoredQuantity(product.id);
    setCurrentQuantity(quantityToDisplay);
    setInputValue(quantityToDisplay.toString());
  }, [product.id, product.ilosc, getStoredQuantity, source]);

  const handleDecrement = (event) => {
    event.stopPropagation();
    if (source === 'cart') {
      if (currentQuantity > 0) { // Allow decrementing to 0, updateQuantity handles removal
        updateCartItemQuantity(product.id, currentQuantity - 1);
      }
    } else {
      if (currentQuantity > 1) {
        decrementProductQuantity(product.id);
      }
    }
  };

  const handleIncrement = (event) => {
    event.stopPropagation();
    if (source === 'cart') {
      updateCartItemQuantity(product.id, currentQuantity + 1);
    } else {
      incrementProductQuantity(product.id);
    }
  };

  const handleInputChange = (event) => {
    event.stopPropagation();
    const currentDisplayValue = event.target.value;
    setInputValue(currentDisplayValue);
    // For cart, direct update on change might be too aggressive if typing multiple digits.
    // For product table, it updates a temporary stored quantity.
    // Let's make it consistent: update on blur for cart as well, or validate and update if valid number.
    if (currentDisplayValue === "") {
      // Allow empty for typing
    } else {
      const numericValue = parseInt(currentDisplayValue, 10);
      if (!isNaN(numericValue) && numericValue >= 0) { // Allow 0 for cart, it will be removed by updateQuantity
        if (source === 'cart') {
          // Debounce or update on blur might be better here
          // For now, let's update directly if valid for simplicity, CartContext's updateQuantity handles 0.
           setCurrentQuantity(numericValue); // Visually update input
        } else {
          updateStoredQuantity(product.id, numericValue);
        }
      }
    }
  };

  const handleInputBlur = (event) => {
    event.stopPropagation();
    const numericValue = parseInt(inputValue, 10);
    if (source === 'cart') {
      if (!isNaN(numericValue) && numericValue >= 0) {
        updateCartItemQuantity(product.id, numericValue);
      } else {
        // Reset to current cart quantity if input is invalid
        setInputValue(product.ilosc.toString());
      }
    } else {
      commitFinalQuantity(product.id);
    }
  };

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    commitFinalQuantity(product.id);
    const finalQuantityForCart = getStoredQuantity(product.id);
    
    if (finalQuantityForCart > 0) {
      addToCart(product, finalQuantityForCart);
      console.log(`Dodano do koszyka: Produkt ID ${product.id} (${product.nazwa}), Cena: ${product.cena}, Ilość: ${finalQuantityForCart}`);
    } else {
      console.log(`Nie dodano do koszyka: Produkt ID ${product.id}, Ilość musi być większa od 0.`);
    }
  };

  const isDecrementDisabled = source === 'productTable' && currentQuantity <= 1;
  // For cart, decrementing to 0 should be allowed to trigger removal via updateCartItemQuantity.

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
        min={source === 'cart' ? "0" : "1"} 
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
      {source === 'productTable' && (
        <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
      )}
    </div>
  );
};

export default QuantityControl;

