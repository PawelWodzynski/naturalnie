import React from 'react';
import styles from './QuantityControl.module.css';
import { useProductQuantity } from '../../../../../../../../context/ProductQuantityContext';

const QuantityControl = ({ productId }) => {
  const { getQuantity, incrementQuantity, decrementQuantity, updateQuantity } = useProductQuantity();
  const quantity = getQuantity(productId);

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
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      updateQuantity(productId, value);
    } else if (event.target.value === '') {
      // If input is cleared, reset to 1 or handle as per desired behavior
      updateQuantity(productId, 1);
    }
  };

  const handleContainerClick = (event) => {
    event.stopPropagation(); // Prevent row click when interacting with quantity controls
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    console.log(`Dodano do koszyka: Produkt ID ${productId}, Ilość: ${quantity}`);
  };

  return (
    <div className={styles.quantityControlContainer} onClick={handleContainerClick}>
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className={styles.quantityInput} // Use a similar style to the modal's input if available or create a new one
        min="1"
      />
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
    </div>
  );
};

export default QuantityControl;

