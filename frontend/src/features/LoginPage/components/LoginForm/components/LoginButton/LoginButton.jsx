import React from 'react';
import styles from './LoginButton.module.css';

const LoginButton = ({ type = 'submit', children }) => {
  return (
    <button type={type} className={styles.loginButton}>
      {children}
    </button>
  );
};

export default LoginButton;

