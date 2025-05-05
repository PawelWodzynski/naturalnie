import React, { useState } from 'react';
import styles from './RegisterSection.module.css';
import RegisterLink from '../RegisterLink';
import RegistrationModal from '../RegistrationModal';
import RegistrationForm from '../RegistrationForm';

const RegisterSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegisterClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.registerSectionContainer}>
      <RegisterLink onClick={handleRegisterClick} />
      <RegistrationModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <RegistrationForm onSuccess={handleCloseModal} />
      </RegistrationModal>
    </div>
  );
};

export default RegisterSection;

