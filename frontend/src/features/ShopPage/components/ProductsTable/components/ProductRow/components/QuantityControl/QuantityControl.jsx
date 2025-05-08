import React, { useState } from 'react';
import styles from './QuantityControl.module.css';

const QuantityControl = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity - 1)); // Quantity cannot be less than 1
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleAddToCart = () => {
    // Logic to add product to cart will be implemented later
    // For now, just log the action
    console.log(`Dodano do koszyka: Produkt ID ${productId}, Ilość: ${quantity}`);
    // You might want to reset quantity or give feedback to the user here
  };

  return (
    <div className={styles.quantityControlContainer}>
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <span className={styles.quantityDisplay}>{quantity}</span>
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
    </div>
  );
};

export default QuantityControl;

