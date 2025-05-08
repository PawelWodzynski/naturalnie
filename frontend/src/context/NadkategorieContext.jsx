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
    setRefreshKey(prevKey => {
      const nextKey = prevKey + 1;
      console.log(`NadkategorieContext: triggerRefresh called. Old key: ${prevKey}, New key: ${nextKey}`);
      return nextKey;
    });
  }, []); // Empty dependency array for stable function reference

  return (
    <NadkategorieContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </NadkategorieContext.Provider>
  );
};

export default NadkategorieContext;

