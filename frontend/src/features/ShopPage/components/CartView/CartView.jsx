import React from 'react';
import styles from './CartView.module.css';
import { useCart } from '../../../../context/CartContext';

const CartView = () => {
  const { cartItems } = useCart();

  const calculateItemTotalValue = (item) => {
    // Accessing item.cena and item.ilosc directly
    if (item && typeof item.cena === 'number' && typeof item.ilosc === 'number') {
      return (item.ilosc * item.cena).toFixed(2);
    }
    return '0.00'; // Fallback value
  };

  const overallTotal = cartItems.reduce((sum, item) => {
    // Accessing item.cena and item.ilosc directly
    if (item && typeof item.cena === 'number' && typeof item.ilosc === 'number') {
      return sum + (item.ilosc * item.cena);
    }
    return sum;
  }, 0).toFixed(2);

  return (
    <div className={styles.cartViewContainer}>
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Twój koszyk jest pusty.</p>
      ) : (
        <>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Ilość</th>
                <th>Cena jednostkowa</th>
                <th>Wartość</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                // Check if item itself and essential properties exist
                if (!item || typeof item.nazwa === 'undefined' || typeof item.cena === 'undefined' || typeof item.ilosc === 'undefined') {
                  console.warn('Invalid cart item structure:', item);
                  return (
                    <tr key={`invalid-item-${index}`}>
                      <td colSpan="4">Błędny produkt w koszyku (brak danych)</td>
                    </tr>
                  );
                }
                return (
                  // Use item.id directly as key, assuming it's unique from CartContext
                  <tr key={item.id || `item-${index}`}> 
                    <td>{item.nazwa}</td>
                    <td>{item.ilosc}</td>
                    <td>{`${item.cena.toFixed(2)} zł`}</td>
                    <td>{calculateItemTotalValue(item)} zł</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Łączna wartość:</td>
                <td style={{ fontWeight: 'bold' }}>{overallTotal} zł</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default CartView;

