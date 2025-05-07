import React from 'react';
import styles from './ImageTile.module.css';

const ImageTile = ({ image, index, onRemove, onDescriptionChange, onDragStart, onDragOver, onDrop }) => {
  const handleDescriptionInput = (e) => {
    onDescriptionChange(e.target.value);
  };

  return (
    <div 
      className={styles.imageTile}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <img src={`data:image/jpeg;base64,${image.daneZdjecia}`} alt={image.opis || `Zdjęcie ${image.kolejnosc}`} className={styles.imagePreview} />
      <textarea 
        className={styles.descriptionInput}
        placeholder="Dodaj opis (opcjonalnie)"
        value={image.opis || ''}
        onChange={handleDescriptionInput}
        rows="2"
      />
      <button onClick={onRemove} className={styles.removeButton}>Usuń</button>
      <div className={styles.imageOrder}>{image.kolejnosc}</div>
    </div>
  );
};

export default ImageTile;
