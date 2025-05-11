import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../utils/tokenUtils';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Helper function to get cart storage key based on JWT token
const getCartStorageKey = () => {
  const token = getToken();
  if (!token) return 'cart_anonymous';
  
  // Use a hash of the token as the key to avoid storing the full token
  // This is a simple hash function for demonstration
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `cart_${hash}`;
};

// Helper function to migrate anonymous cart to user cart when logging in
const migrateAnonymousCart = (userCartKey) => {
  const anonymousCartData = localStorage.getItem('cart_anonymous');
  if (anonymousCartData && !localStorage.getItem(userCartKey)) {
    localStorage.setItem(userCartKey, anonymousCartData);
    localStorage.removeItem('cart_anonymous');
    return JSON.parse(anonymousCartData);
  }
  return null;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const storageKey = getCartStorageKey();
    
    // Check if we need to migrate from anonymous cart
    if (getToken() && storageKey !== 'cart_anonymous') {
      const migratedCart = migrateAnonymousCart(storageKey);
      if (migratedCart) return migratedCart;
    }
    
    const savedCart = localStorage.getItem(storageKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Update localStorage whenever cart changes
  useEffect(() => {
    const storageKey = getCartStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
    
    let itemsCount = 0;
    let priceSum = 0;
    cartItems.forEach(item => {
      itemsCount += item.ilosc;
      priceSum += item.cena * item.ilosc;
    });
    setTotalItems(itemsCount);
    setTotalPrice(parseFloat(priceSum.toFixed(2)));
  }, [cartItems]);

  // Check for token changes (login/logout) and update cart accordingly
  useEffect(() => {
    const handleTokenChange = () => {
      const storageKey = getCartStorageKey();
      
      // Check if we need to migrate from anonymous cart
      if (getToken() && storageKey !== 'cart_anonymous') {
        const migratedCart = migrateAnonymousCart(storageKey);
        if (migratedCart) {
          setCartItems(migratedCart);
          return;
        }
      }
      
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
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
      window.removeEventListener('storage', handleTokenChange);
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, ilosc: item.ilosc + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, ilosc: quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, ilosc: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    // Also clear from localStorage
    const storageKey = getCartStorageKey();
    localStorage.removeItem(storageKey);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
