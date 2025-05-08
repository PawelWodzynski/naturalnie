import React from 'react';
import styles from './ProductDetailModal.module.css';
import ImageCarousel from './components/ImageCarousel';
import ProductDetailItem from './components/ProductDetailItem';

const ProductDetailModal = ({ isOpen, onClose, productItem }) => {
  if (!isOpen || !productItem) {
    return null;
  }

  const { produkt, zdjecia } = productItem;

  // Fallback for produkt if it's null or undefined
  const p = produkt || {};

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{p.nazwa || 'Szczegóły produktu'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.carouselSection}>
            <ImageCarousel images={zdjecia || []} />
          </div>
          <div className={styles.detailsSection}>
            <h3>Informacje o produkcie:</h3>
            <ProductDetailItem label="Kod EAN" value={p.kodEanKod} />
            <ProductDetailItem label="Rodzaj produktu" value={p.rodzajProduktuNazwa} />
            <ProductDetailItem label="Dostępność" value={p.dostepny ? 'Tak' : 'Nie'} />
            <ProductDetailItem label="Cena" value={p.cena ? `${(p.cena / 100).toFixed(2)} zł` : '-'} />
            <ProductDetailItem label="Jednostka" value={p.jednostkaNazwa} />
            <ProductDetailItem label="Opakowanie" value={p.opakowanieNazwa} />
            <ProductDetailItem label="Stawka VAT" value={p.stawkaVatNazwa ? `${p.stawkaVatNazwa}%` : '-'} />
            <ProductDetailItem label="PKWiU" value={p.pkwiU} />
            <ProductDetailItem label="Opis" value={p.opis} />
            {/* Add more details as needed using ProductDetailItem */}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.footerCloseButton}>Zamknij</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

