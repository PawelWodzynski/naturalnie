import React, { useCallback, useState } from 'react';
import styles from './ImageUploadManager.module.css';
import ImageTile from './components/ImageTile';

const ImageUploadManager = ({ images = [], onImagesChange }) => { // Added default value for images
  const [draggedImage, setDraggedImage] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const currentImages = images || []; // Ensure images is an array
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          daneZdjecia: reader.result.split(',')[1], 
          opis: '', 
          kolejnosc: currentImages.length + 1,
          id: Date.now() + Math.random()
        };
        onImagesChange([...currentImages, newImage]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = null; 
  };

  const handleRemoveImage = (indexToRemove) => {
    const currentImages = images || [];
    const newImages = currentImages.filter((_, index) => index !== indexToRemove)
                            .map((img, idx) => ({ ...img, kolejnosc: idx + 1 }));
    onImagesChange(newImages);
  };

  const handleDescriptionChange = (index, newDescription) => {
    const currentImages = images || [];
    const newImages = currentImages.map((img, idx) => 
      idx === index ? { ...img, opis: newDescription } : img
    );
    onImagesChange(newImages);
  };

  const handleDragStart = (index) => {
    const currentImages = images || [];
    setDraggedImage(currentImages[index]);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); 
  };

  const handleDrop = (targetIndex) => {
    if (!draggedImage) return;
    const currentImages = images || [];
    const newImages = [...currentImages];
    const draggedImageIndex = newImages.findIndex(img => img.id === draggedImage.id);

    if (draggedImageIndex === -1) return; 

    newImages.splice(draggedImageIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    const reorderedImages = newImages.map((img, idx) => ({ ...img, kolejnosc: idx + 1 }));
    onImagesChange(reorderedImages);
    setDraggedImage(null);
  };
  
  const safeImages = images || []; // Ensure images is always an array for sort and map

  return (
    <div className={styles.imageManagerContainer}>
      <div className={styles.fileInputContainer}>
        <label htmlFor="imageUpload" className={styles.fileInputLabel}>
          Dodaj zdjęcia (kliknij lub przeciągnij)
        </label>
        <input 
          type="file" 
          id="imageUpload" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
          className={styles.fileInput}
        />
      </div>
      <div className={styles.imageList}>
        {safeImages.sort((a, b) => a.kolejnosc - b.kolejnosc).map((image, index) => (
          <ImageTile 
            key={image.id || index} 
            image={image} 
            index={index} 
            onRemove={() => handleRemoveImage(index)}
            onDescriptionChange={(newDesc) => handleDescriptionChange(index, newDesc)}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploadManager;

