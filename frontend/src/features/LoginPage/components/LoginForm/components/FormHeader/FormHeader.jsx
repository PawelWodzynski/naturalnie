import React from 'react';
import styles from './FormHeader.module.css';

const FormHeader = ({ title }) => {
  return (
    <h2 className={styles.formHeader}>{title}</h2>
  );
};

export default FormHeader;

