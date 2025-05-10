import React from 'react';
import styles from './CartView.module.css';
import { useCart } from '../../../../context/CartContext';
import QuantityControl from '../ProductsTable/components/ProductRow/components/QuantityControl';

const CartView = () => {
  const { cartItems, removeFromCart } = useCart(); // Destructure removeFromCart from context

  const calculateItemTotalValue = (item) => {
    if (item && typeof item.cena === 'number' && typeof item.ilosc === 'number') {
      return (item.ilosc * item.cena).toFixed(2);
    }
    return '0.00';
  };

  const overallTotal = cartItems.reduce((sum, item) => {
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
                <th>Akcje</th> {/* New column header */}
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                if (!item || typeof item.nazwa === 'undefined' || typeof item.cena === 'undefined' || typeof item.ilosc === 'undefined') {
                  console.warn('Invalid cart item structure:', item);
                  return (
                    <tr key={`invalid-item-${index}`}>
                      <td colSpan="5">Błędny produkt w koszyku (brak danych)</td> {/* Adjusted colSpan */}
                    </tr>
                  );
                }
                return (
                  <tr key={item.id || `item-${index}`}>
                    <td>{item.nazwa}</td>
                    <td>
                      <QuantityControl product={item} source="cart" />
                    </td>
                    <td>{`${item.cena.toFixed(2)} zł`}</td>
                    <td>{calculateItemTotalValue(item)} zł</td>
                    <td> {/* New cell for the remove button */}
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className={styles.removeButton} /* Added a class for styling */
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Łączna wartość:</td> {/* Adjusted colSpan */}
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

