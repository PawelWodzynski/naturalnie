import React from 'react';
import styles from './CartView.module.css';
import { useCart } from '../../../../context/CartContext';
import QuantityControl from '../ProductsTable/components/ProductRow/components/QuantityControl';

const CartView = ({ onShowPaymentView }) => {
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

  const handleCompleteOrder = () => {
    console.log('Proceeding to payment confirmation with items:', cartItems);
    if (onShowPaymentView) {
      onShowPaymentView();
    }
  };

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
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                if (!item || typeof item.nazwa === 'undefined' || typeof item.cena === 'undefined' || typeof item.ilosc === 'undefined') {
                  console.warn('Invalid cart item structure:', item);
                  return (
                    <tr key={`invalid-item-${index}`}>
                      <td colSpan="5">Błędny produkt w koszyku (brak danych)</td>
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
                    <td>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className={styles.removeButton}
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
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Łączna wartość:</td>
                <td style={{ fontWeight: 'bold' }}>{overallTotal} zł</td>
              </tr>
            </tfoot>
          </table>
          
          <div className={styles.completeOrderContainer}>
            <button 
              onClick={handleCompleteOrder} 
              className={styles.completeOrderButton}
              disabled={cartItems.length === 0}
            >
              Zrealizuj zamówienie
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartView;
