import { useState, useEffect } from 'react';

export const useTokenDisplayLogic = () => {
  const [token, setToken] = useState(null);

  // Effect to read the token from localStorage when the component mounts
  // and potentially update if it changes (though localStorage changes don't trigger re-renders automatically)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    // Optional: Add a listener for storage events if the token might be updated
    // by other tabs/windows, though this is often overkill for simple display.
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        setToken(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    token,
  };
};

