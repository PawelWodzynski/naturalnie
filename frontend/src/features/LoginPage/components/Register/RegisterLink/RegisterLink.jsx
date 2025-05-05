import React from 'react';
import styles from './RegisterLink.module.css';

const RegisterLink = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className={styles.registerLink}>
      Register
    </button>
  );
};

export default RegisterLink;

