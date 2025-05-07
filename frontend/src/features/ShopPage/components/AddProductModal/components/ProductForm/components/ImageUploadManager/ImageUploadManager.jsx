import React, { useCallback, useState } from 'react';
import styles from './ImageUploadManager.module.css';
import ImageTile from './components/ImageTile';

const ImageUploadManager = ({ images, onImagesChange }) => {
  const [draggedImage, setDraggedImage] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          daneZdjecia: reader.result.split(',')[1], // Get base64 part
          opis: '', // User can add description later if needed, or we add a field
          kolejnosc: images.length + 1,
          id: Date.now() + Math.random() // Temporary unique ID for mapping and drag-drop key
        };
        onImagesChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = null; // Reset file input
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)
                            .map((img, idx) => ({ ...img, kolejnosc: idx + 1 }));
    onImagesChange(newImages);
  };

  const handleDescriptionChange = (index, newDescription) => {
    const newImages = images.map((img, idx) => 
      idx === index ? { ...img, opis: newDescription } : img
    );
    onImagesChange(newImages);
  };

  // Drag and Drop Handlers
  const handleDragStart = (index) => {
    setDraggedImage(images[index]);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (targetIndex) => {
    if (!draggedImage) return;

    const newImages = [...images];
    const draggedImageIndex = newImages.findIndex(img => img.id === draggedImage.id);

    if (draggedImageIndex === -1) return; // Should not happen

    // Remove dragged image from its original position
    newImages.splice(draggedImageIndex, 1);
    // Insert dragged image at the target position
    newImages.splice(targetIndex, 0, draggedImage);

    // Update 'kolejnosc' based on new order
    const reorderedImages = newImages.map((img, idx) => ({ ...img, kolejnosc: idx + 1 }));
    onImagesChange(reorderedImages);
    setDraggedImage(null);
  };

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
        {images.sort((a, b) => a.kolejnosc - b.kolejnosc).map((image, index) => (
          <ImageTile 
            key={image.id || index} // Use a more stable key if available, e.g., image.id from backend
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
