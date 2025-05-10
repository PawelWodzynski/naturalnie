import React from 'react';
import styles from './CartView.module.css';
import { useCart } from '../../../../context/CartContext'; // Import useCart

const CartView = () => {
  const { cartItems } = useCart(); // Use cartItems from context

  const calculateTotalValue = (item) => {
    // Defensive check for item.produkt and item.produkt.cena
    if (item && item.produkt && typeof item.produkt.cena === 'number' && typeof item.quantity === 'number') {
      return (item.quantity * item.produkt.cena).toFixed(2);
    }
    return '0.00'; // Fallback value
  };

  const overallTotal = cartItems.reduce((sum, item) => {
    // Defensive check for item.produkt and item.produkt.cena
    if (item && item.produkt && typeof item.produkt.cena === 'number' && typeof item.quantity === 'number') {
      return sum + (item.quantity * item.produkt.cena);
    }
    return sum; // Continue sum without adding if item is invalid
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
                // Defensive checks for item and item.produkt before rendering a row
                if (!item || !item.produkt) {
                  console.warn('Invalid cart item structure:', item);
                  return (
                    <tr key={`invalid-item-${index}`}>
                      <td colSpan="4">Błędny produkt w koszyku</td>
                    </tr>
                  );
                }
                return (
                  <tr key={item.produkt.id || `item-${index}`}> {/* Fallback key if id is missing */}
                    <td>{item.produkt.nazwa || 'Brak nazwy'}</td>
                    <td>{typeof item.quantity === 'number' ? item.quantity : 0}</td>
                    <td>{typeof item.produkt.cena === 'number' ? `${item.produkt.cena.toFixed(2)} zł` : 'Brak ceny'}</td>
                    <td>{calculateTotalValue(item)} zł</td>
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

