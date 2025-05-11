import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../utils/tokenUtils';

const DeliveryDateContext = createContext();

export const useDeliveryDate = () => useContext(DeliveryDateContext);

// Helper function to check if data is older than 3 hours
const isDataStale = (timestamp) => {
  if (!timestamp) return true;
  
  const currentTime = new Date().getTime();
  const threeHoursInMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  return (currentTime - timestamp) > threeHoursInMs;
};

// Helper function to get delivery date storage key based on JWT token
const getDeliveryDateStorageKey = () => {
  const token = getToken();
  if (!token) return 'deliveryDate_anonymous';
  
  // Use a hash of the token as the key to avoid storing the full token
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `deliveryDate_${hash}`;
};

export const DeliveryDateProvider = ({ children }) => {
  // Initialize with today's date or from localStorage if available
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const storageKey = getDeliveryDateStorageKey();
    const savedDate = localStorage.getItem(storageKey);
    
    if (savedDate) {
      const { date, timestamp } = JSON.parse(savedDate);
      // Check if the data is stale
      if (!isDataStale(timestamp)) {
        return new Date(date);
      }
    }
    
    // Default to today's date if no saved date or data is stale
    return new Date();
  });
  
  const [isDateSelected, setIsDateSelected] = useState(() => {
    const storageKey = getDeliveryDateStorageKey();
    const savedDate = localStorage.getItem(storageKey);
    
    if (savedDate) {
      const { selected, timestamp } = JSON.parse(savedDate);
      // Check if the data is stale
      if (!isDataStale(timestamp)) {
        return selected;
      }
    }
    
    return false; // Default to not selected
  });
  
  const [lastUpdateTime, setLastUpdateTime] = useState(() => {
    const storageKey = getDeliveryDateStorageKey();
    const savedDate = localStorage.getItem(storageKey);
    
    if (savedDate) {
      const { timestamp } = JSON.parse(savedDate);
      if (!isDataStale(timestamp)) {
        return timestamp;
      }
    }
    
    return null;
  });

  // Save to localStorage whenever date changes
  useEffect(() => {
    const storageKey = getDeliveryDateStorageKey();
    const now = new Date().getTime();
    
    localStorage.setItem(storageKey, JSON.stringify({
      date: deliveryDate.toISOString(),
      selected: isDateSelected,
      timestamp: now
    }));
    
    setLastUpdateTime(now);
  }, [deliveryDate, isDateSelected]);

  // Check for token changes and update state accordingly
  useEffect(() => {
    const handleTokenChange = () => {
      const storageKey = getDeliveryDateStorageKey();
      const savedDate = localStorage.getItem(storageKey);
      
      if (savedDate) {
        const { date, selected, timestamp } = JSON.parse(savedDate);
        
        // Check if the data is stale
        if (!isDataStale(timestamp)) {
          setDeliveryDate(new Date(date));
          setIsDateSelected(selected);
          setLastUpdateTime(timestamp);
          return;
        }
      }
      
      // Default to today's date if no saved date or data is stale
      setDeliveryDate(new Date());
      setIsDateSelected(false);
      setLastUpdateTime(null);
    };

    // Listen for storage events (in case token changes in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        handleTokenChange();
      }
    });
    
    // Also listen for our own token changes
    window.addEventListener('tokenChanged', handleTokenChange);
    
    return () => {
      window.removeEventListener('storage', (event) => {
        if (event.key === 'token') handleTokenChange();
      });
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  const updateDeliveryDate = (date) => {
    setDeliveryDate(date);
    setIsDateSelected(true);
  };

  const clearDeliveryDate = () => {
    setDeliveryDate(new Date());
    setIsDateSelected(false);
  };

  const formatDate = (date = deliveryDate) => {
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <DeliveryDateContext.Provider
      value={{
        deliveryDate,
        isDateSelected,
        updateDeliveryDate,
        clearDeliveryDate,
        formatDate
      }}
    >
      {children}
    </DeliveryDateContext.Provider>
  );
};
