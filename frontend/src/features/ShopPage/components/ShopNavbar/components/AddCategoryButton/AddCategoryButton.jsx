import React from 'react';
import styles from './AddCategoryButton.module.css';

const AddCategoryButton = ({ onClick }) => {
  return (
    <button className={styles.addCategoryButton} onClick={onClick}>
      Dodaj kategorię
    </button>
  );
};

export default AddCategoryButton;

