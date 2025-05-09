import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the context
const ProductQuantityContext = createContext();

// Custom hook to use the ProductQuantityContext
export const useProductQuantity = () => {
  return useContext(ProductQuantityContext);
};

// Provider component
export const ProductQuantityProvider = ({ children }) => {
  const [productQuantities, setProductQuantities] = useState({}); // Stores { productId: quantity }

  // Function to get quantity for a specific product, defaults to 1 if not set
  const getQuantity = useCallback((productId) => {
    return productQuantities[productId] === undefined ? 1 : productQuantities[productId];
  }, [productQuantities]);

  // Function to update quantity for a specific product
  const updateQuantity = useCallback((productId, newQuantity) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, newQuantity) // Ensure quantity is at least 1
    }));
  }, []);

  // Function to increment quantity for a specific product
  const incrementQuantity = useCallback((productId) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] === undefined ? 1 : prevQuantities[productId]) + 1
    }));
  }, []);

  // Function to decrement quantity for a specific product
  const decrementQuantity = useCallback((productId) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] === undefined ? 1 : prevQuantities[productId]) - 1)
    }));
  }, []);

  const value = {
    getQuantity,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    productQuantities // Exposing this for debugging or complex scenarios if needed
  };

  return (
    <ProductQuantityContext.Provider value={value}>
      {children}
    </ProductQuantityContext.Provider>
  );
};

export default ProductQuantityContext;

