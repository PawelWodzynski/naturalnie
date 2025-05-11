import React, { useState, useEffect } from 'react';
import styles from './OrdersView.module.css';
import { getToken } from '../../../../utils/tokenUtils';
import OrderItem from './components/OrderItem';

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Brak tokenu uwierzytelniającego. Zaloguj się.');
        }
        
        const encodedToken = encodeURIComponent(token);
        const response = await fetch(`http://localhost:8080/api/zamowienia?token=${encodedToken}&page=${page}&size=10`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Błąd serwera: ${response.status}` }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success && result.data) {
          setOrders(result.data.zamowienia);
          setTotalPages(result.data.totalPages);
        } else {
          throw new Error(result.message || 'Nie udało się pobrać zamówień.');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Wystąpił błąd podczas pobierania zamówień.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [page, refreshKey]);
  
  const handleCompleteOrder = async (orderId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Brak tokenu uwierzytelniającego. Zaloguj się.');
      }
      
      const encodedToken = encodeURIComponent(token);
      const response = await fetch(`http://localhost:8080/api/zamowienia/complete/${orderId}?token=${encodedToken}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Błąd serwera: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.zamowienieId === orderId 
              ? { ...order, zrealizowane: true } 
              : order
          )
        );
      } else {
        throw new Error(result.message || 'Nie udało się zakończyć realizacji zamówienia.');
      }
    } catch (err) {
      console.error('Error completing order:', err);
      alert(`Błąd: ${err.message || 'Wystąpił błąd podczas zakończenia realizacji zamówienia.'}`);
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };
  
  const refreshOrders = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Ładowanie zamówień...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={refreshOrders} className={styles.refreshButton}>Odśwież</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className={styles.emptyContainer}>Brak zamówień do wyświetlenia.</div>;
  }

  return (
    <div className={styles.ordersViewContainer}>
      <h2>Zamówienia</h2>
      
      <div className={styles.ordersList}>
        {orders.map(order => (
          <OrderItem 
            key={order.zamowienieId} 
            order={order} 
            onComplete={() => handleCompleteOrder(order.zamowienieId)} 
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 0}
            className={styles.paginationButton}
          >
            Poprzednia
          </button>
          <span className={styles.pageInfo}>
            Strona {page + 1} z {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages - 1}
            className={styles.paginationButton}
          >
            Następna
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
