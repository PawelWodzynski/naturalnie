import React from 'react';
import styles from './IngredientsSection.module.css';
import SkladnikiDropdownField from '../SkladnikiDropdownField'; // Adjusted path

const IngredientsSection = ({
  skladniki,
  apiToken,
  handleSkladnikSelectedFromDropdown,
  handleAddNewSkladnikManual,
  handleRemoveSkladnik,
  // isDuplicateModalOpen, // This state and its setter likely remain in the parent or a shared context
  // setIsDuplicateModalOpen,
  // duplicateModalMessage
}) => {
  return (
    <div className={styles.formGroupFullWidth}>
      <label>Składniki (dodaj pojedynczo):</label>
      {apiToken ? (
        <SkladnikiDropdownField
          apiToken={apiToken}
          onSkladnikSelected={handleSkladnikSelectedFromDropdown}
          onNewSkladnikAdd={handleAddNewSkladnikManual}
        />
      ) : (
        <div>Ładowanie tokenu API lub token niedostępny...</div>
      )}
      <ul className={styles.skladnikiList}>
        {skladniki.map((skladnik, index) => (
          <li key={index} className={styles.skladnikItem}>
            {skladnik}
            <button type="button" onClick={() => handleRemoveSkladnik(index)} className={styles.removeButtonSkladnik}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsSection;

