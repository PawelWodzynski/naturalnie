import React, { useState } from 'react';
import styles from './PaymentConfirmationView.module.css';
import { useCart } from '../../../../context/CartContext';
import { useAddress } from '../../../../context/AddressContext';
import { useDeliveryDate } from '../../../../context/DeliveryDateContext';
import { getToken } from '../../../../utils/tokenUtils';

const PaymentConfirmationView = ({ onConfirm }) => {
  const { cartItems, clearCart } = useCart();
  const { getFormattedAddress, useAlternativeAddress, formData } = useAddress();
  const { deliveryDate, formatDate } = useDeliveryDate();
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleConfirmClick = async () => {
    if (cartItems.length === 0) {
      setSubmitError('Koszyk jest pusty. Dodaj produkty przed złożeniem zamówienia.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Get token for authentication
      const token = getToken();
      if (!token) {
        throw new Error('Brak tokenu uwierzytelniającego. Zaloguj się.');
      }

      // Format the products object as required by the API
      const produkty = {};
      cartItems.forEach(item => {
        if (item && item.id && item.ilosc) {
          produkty[item.id] = item.ilosc;
        }
      });

      // Generate a transaction number
      const numerTransakcji = `TXN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      // Format the delivery date as YYYY-MM-DD
      const dataDostawy = formatDate(deliveryDate).split('.').reverse().join('-');

      // Prepare the request body
      const requestBody = {
        imie: formData.firstName,
        nazwisko: formData.lastName,
        mail: formData.email,
        useAlternativeAddress: useAlternativeAddress,
        produkty: produkty,
        dataDostawy: dataDostawy,
        numerTransakcji: numerTransakcji
      };

      // Encode the token for the URL
      const encodedToken = encodeURIComponent(token);

      // Send the request to the backend
      const response = await fetch(`http://localhost:8080/api/zamowienia?token=${encodedToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Błąd serwera: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Order confirmed successfully:', result);
      setSubmitSuccess(true);
      
      // Clear the cart after successful order submission
      clearCart();
      
      if (onConfirm) {
        onConfirm(paymentMethod);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitError(error.message || 'Wystąpił błąd podczas składania zamówienia.');
    } finally {
      setIsSubmitting(false);
    }
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
        {submitError && <p className={styles.errorMessage}>{submitError}</p>}
        {submitSuccess && <p className={styles.successMessage}>Zamówienie przechodzi do realizacji!</p>}
        <button 
          onClick={handleConfirmClick} 
          className={styles.confirmButton}
          disabled={cartItems.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Przetwarzanie...' : 'Potwierdź'}
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmationView;
