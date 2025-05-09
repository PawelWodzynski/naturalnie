import React, { useState } from 'react'; // Removed useEffect
import styles from './ImageCarousel.module.css';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle cases where images might be undefined or empty
  if (!images || images.length === 0) {
    return <div className={styles.noImage}>Brak zdjęć produktu</div>;
  }

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentImage = images[currentIndex];
  const imageUrl = currentImage && currentImage.daneZdjecia
    ? `data:image/jpeg;base64,${currentImage.daneZdjecia}`
    : 'https://via.placeholder.com/400x300?text=Brak+obrazka'; // Placeholder if image data is missing

  return (
    <div className={styles.carouselContainer}>
      {images.length > 1 && (
        <button onClick={goToPrevious} className={`${styles.carouselButton} ${styles.prevButton}`}>
          &#10094; {/* Left arrow */}
        </button>
      )}
      <img src={imageUrl} alt={`Zdjęcie produktu ${currentIndex + 1}`} className={styles.carouselImage} />
      {images.length > 1 && (
        <button onClick={goToNext} className={`${styles.carouselButton} ${styles.nextButton}`}>
          &#10095; {/* Right arrow */}
        </button>
      )}
      {images.length > 1 && (
        <div className={styles.dotsContainer}>
          {images.map((_, index) => (
            <span 
              key={index} 
              className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;

