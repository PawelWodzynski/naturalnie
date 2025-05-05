import React from 'react';
import styles from './ApiStatusDisplay.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ApiStatusDisplay = ({ status }) => {
  // status is expected to be an object like: { success: boolean | null, message: string, error: string | null }
  if (status.success === null) {
    return null; // Don't render anything if the test hasn't run or is loading
  }

  return (
    <div 
      className={`${styles.statusContainer} ${status.success ? styles.successBg : styles.errorBg}`} // Use styles
    >
      <div className={styles.statusHeader}> {/* Use styles */}
        {status.success ? (
          <>
            <FaCheckCircle className={styles.successIcon} /> {/* Use styles */}
            <span className={styles.statusText}>Sukces</span> {/* Use styles */}
          </>
        ) : (
          <>
            <FaTimesCircle className={styles.errorIcon} /> {/* Use styles */}
            <span className={styles.statusText}>Błąd</span> {/* Use styles */}
          </>
        )}
      </div>
      <p className={styles.messageText}> {/* Use styles */}
        {status.success 
          ? status.message 
          : status.error}
      </p>
    </div>
  );
};

export default ApiStatusDisplay;

