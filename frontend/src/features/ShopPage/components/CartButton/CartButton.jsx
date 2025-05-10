import React from 'react';
import { useCart } from '../../../../context/CartContext';
import styles from './CartButton.module.css';

const CartButton = ({ onClick }) => { // Added onClick prop
  const { totalPrice, totalItems } = useCart();

  // Do not render the button if the cart is empty, but still allow it to be functional if it's part of a larger component that might always be visible.
  // The parent component (ProductsViewContainer) will decide if the button should be rendered or not based on its own logic or if it's always visible.
  // For now, we'll keep the original logic of not rendering if cart is empty, as the primary function is to show cart summary.
  // However, if the button's sole purpose becomes to *toggle* a view, this might need to change.

  if (totalItems === 0) {
    // If the button is also meant to *open* an empty cart view, then it should always render.
    // For now, assuming it only shows summary and then toggles.
    // Let's make it always render but disabled if cart is empty, and the text changes.
    // Or, better, let the parent decide if it should be there. The current implementation in ProductsViewContainer shows it.
    // The request is to make it toggle the view. So it should be clickable.
    // Let's assume the button should be visible to allow opening the cart view even if empty.
    // The text can indicate it's empty.
  }

  return (
    <button className={styles.cartButton} onClick={onClick}> {/* Used onClick prop */}
      {totalItems > 0 
        ? `Koszyk: ${totalPrice.toFixed(2)} zł (${totalItems} ${totalItems === 1 ? 'produkt' : 'produktów'})`
        : 'Koszyk (pusty)'}
    </button>
  );
};

export default CartButton;

