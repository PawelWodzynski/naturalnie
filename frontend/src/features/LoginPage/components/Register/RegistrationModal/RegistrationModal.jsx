import React from 'react';
import styles from './RegistrationModal.module.css';
import RegistrationForm from '../RegistrationForm';
// Placeholder for RegistrationForm
// import RegistrationForm from '../RegistrationForm/RegistrationForm';

const RegistrationModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}> {/* Close on overlay click */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside content */}
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 style={{color : "black" }}>Register</h2>
        <RegistrationForm/>
      </div>
    </div>
  );
};

export default RegistrationModal;

