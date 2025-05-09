import React from 'react';
import styles from './QuantityControl.module.css';
import { useProductQuantity } from '../../../../../../../../context/ProductQuantityContext'; // Adjusted path

const QuantityControl = ({ productId }) => {
  const { getQuantity, incrementQuantity, decrementQuantity } = useProductQuantity();
  const quantity = getQuantity(productId);

  const handleDecrement = (event) => {
    event.stopPropagation(); // Prevent event bubbling to the row
    decrementQuantity(productId);
  };

  const handleIncrement = (event) => {
    event.stopPropagation(); // Prevent event bubbling to the row
    incrementQuantity(productId);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation(); // Prevent event bubbling to the row
    // Logic to add product to cart will be implemented later
    // For now, just log the action
    console.log(`Dodano do koszyka: Produkt ID ${productId}, Ilość: ${quantity}`);
    // You might want to reset quantity or give feedback to the user here
  };

  return (
    <div className={styles.quantityControlContainer} onClick={(e) => e.stopPropagation()}> {/* Also stop propagation on the container div if necessary */}
      <button onClick={handleDecrement} className={styles.quantityButton}>-</button>
      <span className={styles.quantityDisplay}>{quantity}</span>
      <button onClick={handleIncrement} className={styles.quantityButton}>+</button>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj</button>
    </div>
  );
};

export default QuantityControl;

