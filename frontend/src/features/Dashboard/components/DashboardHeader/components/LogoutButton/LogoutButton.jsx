import React from 'react';
import styles from './LogoutButton.module.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { useLogoutButtonLogic } from './LogoutButton';

const LogoutButton = () => {
  const { handleLogout } = useLogoutButtonLogic();

  return (
    <button 
      onClick={handleLogout} 
      className={styles.logoutButton} // Use styles from CSS module
    >
      <FaSignOutAlt />
      <span>Wyloguj</span>
    </button>
  );
};

export default LogoutButton;

