import React from 'react';
import styles from './ShowOrdersButton.module.css';

const ShowOrdersButton = ({ onClick }) => {
  return (
    <button className={styles.showOrdersButton} onClick={onClick}>
      Pokaż Zamówienia
    </button>
  );
};

export default ShowOrdersButton;
