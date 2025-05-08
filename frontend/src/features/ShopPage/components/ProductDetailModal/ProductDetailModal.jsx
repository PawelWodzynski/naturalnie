import React, { useState } from 'react'; // Added useState
import styles from './ProductDetailModal.module.css';
import ImageCarousel from './components/ImageCarousel';
import ProductDetailItem from './components/ProductDetailItem';
import QuantityControlModal from './components/QuantityControlModal'; // Import QuantityControlModal

const ProductDetailModal = ({ isOpen, onClose, productItem }) => {
  const [currentQuantity, setCurrentQuantity] = useState(1); // State for quantity

  if (!isOpen || !productItem) {
    return null;
  }

  const { produkt, zdjecia } = productItem;
  const p = produkt || {}; // Fallback for produkt if it's null or undefined

  const formatBoolean = (value) => (value === true ? 'Tak' : value === false ? 'Nie' : '-');

  const handleQuantityChange = (newQuantity) => {
    setCurrentQuantity(newQuantity);
    console.log(`Quantity changed to: ${newQuantity}`); // Placeholder
  };

  const handleAddToCart = () => {
    console.log(`Adding ${currentQuantity} of ${p.nazwa} to cart.`); // Placeholder
    // Here you would typically dispatch an action to add to cart
    // onClose(); // Optionally close modal after adding to cart
  };

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
            <ProductDetailItem label="Nazwa" value={p.nazwa} />
            <ProductDetailItem label="Kod EAN" value={p.kodEanKod} />
            <ProductDetailItem label="Kod towaru" value={p.kodTowaruKod} />
            <ProductDetailItem label="Identyfikator" value={p.identyfikatorWartosc} />
            <ProductDetailItem label="Cena" value={p.cena ? `${(p.cena / 100).toFixed(2)} zł` : '-'} />
            <ProductDetailItem label="Waga" value={p.waga ? `${p.waga} kg` : '-'} />
            <ProductDetailItem label="Jednostka" value={p.jednostkaNazwa} />
            <ProductDetailItem label="Skrót jednostki" value={p.jednostkaSkrot} />
            <ProductDetailItem label="Opakowanie" value={p.opakowanieNazwa} />
            <ProductDetailItem label="Skrót opakowania" value={p.opakowanieSkrot} />
            <ProductDetailItem label="Opis opakowania" value={p.opakowanieOpis} />
            <ProductDetailItem label="Rodzaj produktu" value={p.rodzajProduktuNazwa} />
            <ProductDetailItem label="Opis rodzaju produktu" value={p.rodzajProduktuOpis} />
            <ProductDetailItem label="Nadkategoria" value={p.nadKategoriaNazwa} />
            <ProductDetailItem label="Opis nadkategorii" value={p.nadKategoriaOpis} />
            <ProductDetailItem label="Kolejność nadkategorii" value={p.nadKategoriaKolejnosc} />
            <ProductDetailItem label="Stawka VAT" value={p.stawkaVatNazwa ? `${p.stawkaVatNazwa}` : (p.stawkaVatWartosc ? `${p.stawkaVatWartosc}%` : '-')} />
            {p.pkwiU && <ProductDetailItem label="PKWiU" value={p.pkwiU} />}
            <ProductDetailItem label="Opis" value={p.opis} />
            {p.skladniki && p.skladniki.length > 0 && (
              <ProductDetailItem label="Składniki" value={p.skladniki.join(', ')} />
            )}

            <h4 className={styles.subHeader}>Statusy i oznaczenia:</h4>
            <ProductDetailItem label="Dostępny" value={formatBoolean(p.dostepny)} />
            <ProductDetailItem label="Dostępny od ręki" value={formatBoolean(p.dostepneOdReki)} />
            <ProductDetailItem label="Dostępny do 7 dni" value={formatBoolean(p.dostepneDo7Dni)} />
            <ProductDetailItem label="Dostępny na zamówienie" value={formatBoolean(p.dostepneNaZamowienie)} />
            <ProductDetailItem label="Super produkt" value={formatBoolean(p.superProdukt)} />
            <ProductDetailItem label="Towar polecany" value={formatBoolean(p.towarPolecany)} />
            <ProductDetailItem label="Rekomendacja sprzedawcy" value={formatBoolean(p.rekomendacjaSprzedawcy)} />
            <ProductDetailItem label="Super cena" value={formatBoolean(p.superCena)} />
            <ProductDetailItem label="Nowość" value={formatBoolean(p.nowosc)} />
            <ProductDetailItem label="Super jakość" value={formatBoolean(p.superjakosc)} />
            <ProductDetailItem label="Rabat" value={formatBoolean(p.rabat)} />
            <ProductDetailItem label="Warto kupić" value={formatBoolean(p.wartoKupic)} />
            <ProductDetailItem label="Bezglutenowy" value={formatBoolean(p.bezglutenowy)} />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <div className={styles.cartControlsContainer}> {/* New container for centering */}
            <QuantityControlModal 
              initialQuantity={currentQuantity} 
              onQuantityChange={handleQuantityChange} 
            />
            <button onClick={handleAddToCart} className={styles.addToCartButton}>
              Dodaj do koszyka
            </button>
          </div>
          <button onClick={onClose} className={styles.footerCloseButton}>Zamknij</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

