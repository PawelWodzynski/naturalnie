import React from 'react';
import styles from './ApiTestButton.module.css';
import { FaSpinner, FaLock } from 'react-icons/fa';

const ApiTestButton = ({ onClick, isLoading }) => {
  // Wrap the original onClick to prevent default button behavior
  const handleClick = (event) => {
    event.preventDefault(); // Prevent default form submission/navigation
    onClick(); // Call the original handler passed as prop
  };

  return (
    <button 
      onClick={handleClick} // Use the wrapped handler
      disabled={isLoading}
      className={styles.testButton} // Use styles from CSS module
      type="button" // Explicitly set type to button to avoid potential submission issues
    >
      {isLoading ? (
        <>
          <FaSpinner className={styles.spinner} /> {/* Use spinner style */}
          <span className={styles.buttonText}>Testowanie...</span> {/* Apply text style */}
        </>
      ) : (
        <>
          <FaLock className={styles.icon} /> {/* Apply icon style */}
          <span className={styles.buttonText}>Testuj autoryzację API</span> {/* Apply text style */}
        </>
      )}
    </button>
  );
};

export default ApiTestButton;

