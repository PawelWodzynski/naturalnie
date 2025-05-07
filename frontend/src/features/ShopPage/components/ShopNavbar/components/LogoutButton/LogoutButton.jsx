import React from 'react';
import styles from './LogoutButton.module.css';
// Assuming FaSignOutAlt is a shared icon or I need to install react-icons
// For now, let's use a simple text or a placeholder if react-icons is not globally available
// import { FaSignOutAlt } from 'react-icons/fa'; 
import { useLogoutButtonLogic } from './LogoutButton';

const LogoutButton = () => {
  const { handleLogout } = useLogoutButtonLogic();

  return (
    <button 
      onClick={handleLogout} 
      className={styles.logoutButton}
    >
      {/* <FaSignOutAlt /> */}
      <span>Wyloguj</span>
    </button>
  );
};

export default LogoutButton;
