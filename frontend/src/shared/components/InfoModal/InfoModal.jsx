import React from 'react';
import styles from './InfoModal.module.css';

const InfoModal = ({ isOpen, onClose, title, message, buttonText = "Zamknij" }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <p className={styles.modalMessage}>{message}</p>
        <button onClick={onClose} className={styles.modalButton}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InfoModal;

