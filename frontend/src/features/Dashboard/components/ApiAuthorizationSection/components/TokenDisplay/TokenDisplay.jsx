import React from 'react';
import styles from './TokenDisplay.module.css';
import { useTokenDisplayLogic } from './TokenDisplay';

const TokenDisplay = () => {
  const { token } = useTokenDisplayLogic();

  return (
    <div className={styles.tokenContainer}> {/* Use styles */}
      <p className={styles.label}>Aktualny token:</p> {/* Use styles */}
      <div className={styles.tokenValueWrapper}> {/* Use styles */}
        <code className={styles.tokenValue}> {/* Use styles */}
          {token || 'Brak tokenu w localStorage'}
        </code>
      </div>
    </div>
  );
};

export default TokenDisplay;

