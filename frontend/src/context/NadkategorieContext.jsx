import React, { createContext, useState, useCallback, useContext } from 'react';

// Create the context
const NadkategorieContext = createContext();

// Create a custom hook to use the NadkategorieContext
export const useNadkategorie = () => {
  const context = useContext(NadkategorieContext);
  if (!context) {
    throw new Error('useNadkategorie must be used within a NadkategorieProvider');
  }
  return context;
};

// Create the Provider component
export const NadkategorieProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
    console.log("Nadkategorie refresh triggered. New key:", refreshKey + 1);
  }, [refreshKey]); // Include refreshKey in dependency array to ensure latest value is used if triggerRefresh is called rapidly, though not strictly necessary for simple increment.

  return (
    <NadkategorieContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </NadkategorieContext.Provider>
  );
};

export default NadkategorieContext; // Exporting context itself can be useful for direct consumption in class components or specific scenarios

