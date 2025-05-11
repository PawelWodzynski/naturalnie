import React, { useState } from 'react';
import styles from './OrderItem.module.css';

const OrderItem = ({ order, onComplete }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',') + ' zł';
  };
  
  const getStatusLabel = (zrealizowane) => {
    return zrealizowane ? 'Zakończone' : 'W realizacji';
  };
  
  const getStatusClass = (zrealizowane) => {
    return zrealizowane ? styles.statusCompleted : styles.statusPending;
  };
  
  const handleCompleteClick = (e) => {
    e.stopPropagation(); // Prevent toggling the expanded state
    if (!order.zrealizowane) {
      onComplete();
    }
  };

  return (
    <div className={styles.orderItemContainer}>
      <div className={styles.orderHeader} onClick={toggleExpanded}>
        <div className={styles.orderInfo}>
          <span className={styles.orderNumber}>Zamówienie #{order.zamowienieId}</span>
          <span className={styles.orderDate}>Data dostawy: {formatDate(order.dataDostawy)}</span>
          <span className={styles.orderCustomer}>{order.imie} {order.nazwisko}</span>
        </div>
        <div className={styles.orderStatus}>
          <span className={getStatusClass(order.zrealizowane)}>
            {getStatusLabel(order.zrealizowane)}
          </span>
          <span className={styles.expandIcon}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      
      {expanded && (
        <div className={styles.orderDetails}>
          <div className={styles.orderSection}>
            <h3>Dane zamówienia</h3>
            <div className={styles.orderData}>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Numer transakcji:</span>
                <span className={styles.dataValue}>{order.numerTransakcji}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Data dostawy:</span>
                <span className={styles.dataValue}>{formatDate(order.dataDostawy)}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Łączna cena:</span>
                <span className={styles.dataValue}>{formatPrice(order.lacznaCena)}</span>
              </div>
              {order.timestamp && (
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Data zamówienia:</span>
                  <span className={styles.dataValue}>{formatDate(order.timestamp)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.orderSection}>
            <h3>Dane klienta</h3>
            <div className={styles.orderData}>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Imię i nazwisko:</span>
                <span className={styles.dataValue}>{order.imie} {order.nazwisko}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Email:</span>
                <span className={styles.dataValue}>{order.mail}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.orderSection}>
            <h3>Adres dostawy</h3>
            <div className={styles.orderData}>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Ulica:</span>
                <span className={styles.dataValue}>
                  {order.address.street} {order.address.buildingNumber}
                  {order.address.apartmentNumber && `/${order.address.apartmentNumber}`}
                </span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Miasto:</span>
                <span className={styles.dataValue}>{order.address.postalCode} {order.address.city}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Województwo:</span>
                <span className={styles.dataValue}>{order.address.voivodeship}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Telefon:</span>
                <span className={styles.dataValue}>{order.address.phoneNumber}</span>
              </div>
              {order.address.companyName && (
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Firma:</span>
                  <span className={styles.dataValue}>{order.address.companyName}</span>
                </div>
              )}
              {order.address.nip && (
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>NIP:</span>
                  <span className={styles.dataValue}>{order.address.nip}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.orderSection}>
            <h3>Produkty</h3>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Kod EAN</th>
                  <th>Kod towaru</th>
                  <th>Identyfikator</th>
                  <th>Waga</th>
                  <th>Ilość</th>
                  <th>Cena jedn.</th>
                  <th>Cena łączna</th>
                </tr>
              </thead>
              <tbody>
                {order.produkty.map((produkt, index) => (
                  <tr key={index}>
                    <td>{produkt.nazwa}</td>
                    <td>{produkt.kodEan}</td>
                    <td>{produkt.kodTowaru}</td>
                    <td>{produkt.identyfikator}</td>
                    <td>{produkt.waga} kg</td>
                    <td>{produkt.ilosc}</td>
                    <td>{formatPrice(produkt.cenaJednostkowa)}</td>
                    <td>{formatPrice(produkt.cenaLaczna)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="7" className={styles.totalLabel}>Łączna wartość:</td>
                  <td className={styles.totalValue}>{formatPrice(order.lacznaCena)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className={styles.orderActions}>
            <button 
              onClick={handleCompleteClick} 
              className={styles.completeButton}
              disabled={order.zrealizowane}
            >
              {order.zrealizowane ? 'Zamówienie zakończone' : 'Zakończ realizację'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
