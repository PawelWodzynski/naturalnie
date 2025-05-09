import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CartButton.module.css';

const CartButton = () => {
  const { cartItems, totalPrice, totalItems } = useCart();

  if (totalItems === 0) {
    return null; // Do not render if cart is empty
  }

  return (
    <button className={styles.cartButton}>
      Koszyk: {totalPrice.toFixed(2)} zł ({totalItems} {totalItems === 1 ? 'produkt' : 'produktów'})
    </button>
  );
};

export default CartButton;
