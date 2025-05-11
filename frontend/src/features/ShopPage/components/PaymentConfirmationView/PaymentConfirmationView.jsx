import React, { useState } from 'react';
import styles from './PaymentConfirmationView.module.css';
import { useCart } from '../../../../context/CartContext';
import { useAddress } from '../../../../context/AddressContext';

const PaymentConfirmationView = ({ onConfirm }) => {
  const { cartItems } = useCart();
  const { getFormattedAddress } = useAddress();
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Get formatted address information
  const addressInfo = getFormattedAddress();

  // Calculate total price from cart items
  const totalPrice = cartItems.reduce((sum, item) => {
    if (item && typeof item.cena === 'number' && typeof item.ilosc === 'number') {
      return sum + (item.ilosc * item.cena);
    }
    return sum;
  }, 0).toFixed(2);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleConfirmClick = () => {
    console.log('Order confirmed with payment method:', paymentMethod);
    if (onConfirm) {
      onConfirm(paymentMethod);
    }
    // Here you would typically send the order to the backend
    alert(`Zamówienie zostało potwierdzone! Metoda płatności: ${getPaymentMethodLabel(paymentMethod)}`);
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'online':
        return 'Płatność online';
      case 'card':
        return 'Płatność kartą';
      case 'blik':
        return 'BLIK';
      default:
        return method;
    }
  };

  return (
    <div className={styles.paymentConfirmationContainer}>
      <h2>Potwierdzenie zamówienia</h2>
      
      <div className={styles.contentContainer}>
        <div className={styles.paymentMethodsContainer}>
          <h3>Wybierz metodę płatności</h3>
          
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={handlePaymentMethodChange}
                className={styles.radioInput}
              />
              <label htmlFor="online" className={styles.radioLabel}>Płatność online</label>
            </div>
            
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={handlePaymentMethodChange}
                className={styles.radioInput}
              />
              <label htmlFor="card" className={styles.radioLabel}>Płatność kartą</label>
            </div>
            
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="blik"
                name="paymentMethod"
                value="blik"
                checked={paymentMethod === 'blik'}
                onChange={handlePaymentMethodChange}
                className={styles.radioInput}
              />
              <label htmlFor="blik" className={styles.radioLabel}>BLIK</label>
            </div>
          </div>
        </div>
        
        <div className={styles.orderSummaryContainer}>
          <h3>Podsumowanie zamówienia</h3>
          
          <div className={styles.orderSummaryContent}>
            <div className={styles.addressInfoContainer}>
              <h4>Adres {addressInfo.isAlternative ? 'alternatywny' : 'główny'}:</h4>
              <div className={styles.addressDetails}>
                {addressInfo.addressLines.map((line, index) => (
                  <p key={index} className={styles.addressLine}>{line}</p>
                ))}
                {addressInfo.phoneNumber && (
                  <p className={styles.addressLine}>Tel: {addressInfo.phoneNumber}</p>
                )}
                {addressInfo.companyName && (
                  <p className={styles.addressLine}>Firma: {addressInfo.companyName}</p>
                )}
                {addressInfo.nip && (
                  <p className={styles.addressLine}>NIP: {addressInfo.nip}</p>
                )}
              </div>
            </div>
            
            <p className={styles.itemCount}>Liczba produktów: {cartItems.length}</p>
            <div className={styles.totalPriceContainer}>
              <span className={styles.totalPriceLabel}>Łączna kwota:</span>
              <span className={styles.totalPriceValue}>{totalPrice} zł</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.confirmButtonContainer}>
        <button 
          onClick={handleConfirmClick} 
          className={styles.confirmButton}
          disabled={cartItems.length === 0}
        >
          Potwierdź
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmationView;
