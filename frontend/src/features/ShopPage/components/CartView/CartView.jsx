import React from 'react';
import styles from './CartView.module.css';
import { useCart } from '../../../../context/CartContext'; // Import useCart

const CartView = () => {
  const { cartItems } = useCart(); // Use cartItems from context

  const calculateTotalValue = (item) => {
    // Assuming item.produkt.cena and item.quantity exist based on CartContext structure
    // Adjust if the structure is different
    return (item.quantity * item.produkt.cena).toFixed(2);
  };

  const overallTotal = cartItems.reduce((sum, item) => {
    // Adjust if the structure is different
    return sum + (item.quantity * item.produkt.cena);
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
              {cartItems.map(item => (
                <tr key={item.produkt.id}> {/* Assuming item.produkt.id is unique */}
                  <td>{item.produkt.nazwa}</td> {/* Assuming item.produkt.nazwa */}
                  <td>{item.quantity}</td>
                  <td>{item.produkt.cena.toFixed(2)} zł</td> {/* Assuming item.produkt.cena */}
                  <td>{calculateTotalValue(item)} zł</td>
                </tr>
              ))}
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

