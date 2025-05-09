import React, { createContext, useState, useContext, useCallback } from 'react';

const ProductQuantityContext = createContext();

export const useProductQuantity = () => {
  return useContext(ProductQuantityContext);
};

export const ProductQuantityProvider = ({ children }) => {
  const [productQuantities, setProductQuantities] = useState({}); // Stores { productId: number }

  // Get the actual stored quantity. Defaults to 1 if product not yet in state (e.g., for initial display).
  const getStoredQuantity = useCallback((productId) => {
    if (productId in productQuantities) {
      return productQuantities[productId];
    }
    return 1; // Default for new/untouched products
  }, [productQuantities]);

  // Update the stored quantity. Allows 0, prevents negatives.
  const updateStoredQuantity = useCallback((productId, newNumericQuantity) => {
    const valueToStore = Math.max(0, Number(newNumericQuantity)); // Ensure it's a number and >= 0
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: valueToStore
    }));
  }, []);

  // Commit the final quantity. If current stored quantity is 0 (or undefined), set to 1.
  const commitFinalQuantity = useCallback((productId) => {
    const currentStoredVal = productQuantities[productId];
    if (currentStoredVal === 0 || currentStoredVal === undefined) {
      // Use updateStoredQuantity to ensure consistent state update
      updateStoredQuantity(productId, 1);
    }
    // If already >= 1, no change needed by commit itself.
  }, [productQuantities, updateStoredQuantity]);

  const incrementQuantity = useCallback((productId) => {
    const currentQuantity = getStoredQuantity(productId);
    updateStoredQuantity(productId, currentQuantity + 1);
  }, [getStoredQuantity, updateStoredQuantity]);

  const decrementQuantity = useCallback((productId) => {
    const currentQuantity = getStoredQuantity(productId);
    // updateStoredQuantity will handle Math.max(0, ...)
    updateStoredQuantity(productId, currentQuantity - 1);
  }, [getStoredQuantity, updateStoredQuantity]);

  const value = {
    getStoredQuantity,    // Renamed from getQuantity for clarity
    updateStoredQuantity, // Renamed from updateQuantity
    commitFinalQuantity,  // New function
    incrementQuantity,
    decrementQuantity,
    // Exposing productQuantities might be useful for debugging or advanced scenarios
    // but components should primarily use the provided functions.
    // productQuantities, 
  };

  return (
    <ProductQuantityContext.Provider value={value}>
      {children}
    </ProductQuantityContext.Provider>
  );
};

export default ProductQuantityContext;

