import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import styles from './ProductDetailModal.module.css';
import ImageCarousel from './components/ImageCarousel';
import ProductDetailItem from './components/ProductDetailItem';
import QuantityControlModal from './components/QuantityControlModal';
import { useProductQuantity } from '../../../../context/ProductQuantityContext'; // Keep for initial quantity if needed, or remove if fully local
import { useCart } from '../../../../context/CartContext';

const ProductDetailModal = ({ isOpen, onClose, productItem }) => {
  const { getStoredQuantity, commitFinalQuantity } = useProductQuantity(); // For initializing and potentially committing back if desired
  const { addToCart } = useCart();
  
  // State for managing quantity within the modal
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && productItem && productItem.produkt) {
      // Initialize quantity when modal opens or product changes
      // Option 1: Always start with 1 for the modal instance
      setModalQuantity(1);
      // Option 2: Try to get a stored/default quantity from context (might be less intuitive for a modal)
      // const initialQty = getStoredQuantity(productItem.produkt.id) || 1;
      // setModalQuantity(initialQty > 0 ? initialQty : 1);
    } else if (!isOpen) {
      setModalQuantity(1); // Reset quantity when modal closes
    }
  }, [isOpen, productItem, getStoredQuantity]); // Add getStoredQuantity if using Option 2

  if (!isOpen || !productItem || !productItem.produkt) {
    return null;
  }

  const { produkt, zdjecia } = productItem;
  const p = produkt;
  const productId = p.id;

  const formatBoolean = (value) => (value === true ? 'Tak' : value === false ? 'Nie' : '-');

  const handleModalQuantityChange = (newQuantity) => {
    setModalQuantity(newQuantity);
    // Optionally, if ProductQuantityContext should also reflect this change immediately:
    // updateStoredQuantity(productId, newQuantity); // This might be too aggressive or cause conflicts
  };

  const handleAddToCart = () => {
    // Before adding to cart, ensure the modal's quantity is committed to ProductQuantityContext
    // This step ensures that if other parts of the app rely on ProductQuantityContext, it's up-to-date.
    // However, for addToCart, we will use the modal's local `modalQuantity` for reliability.
    commitFinalQuantity(productId, modalQuantity); // Commit the current modal quantity to the context

    if (modalQuantity > 0) {
      const productForCart = {
        id: p.id,
        nazwa: p.nazwa,
        cena: p.cena,
      };
      addToCart(productForCart, modalQuantity); // Use modalQuantity
      console.log(`Dodano do koszyka z modala: Produkt ID ${p.id} (${p.nazwa}), Cena: ${p.cena}, Ilość: ${modalQuantity}`);
      onClose(); // Close modal after adding to cart
    } else {
      console.log(`Nie dodano do koszyka z modala: Produkt ID ${p.id}, Ilość musi być większa od 0.`);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{p.nazwa || 'Szczegóły produktu'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        
        {/* Carousel moved to the top, outside of modalBody */}
        <div className={styles.carouselSection}>
          <ImageCarousel images={zdjecia || []} />
        </div>
        
        {/* Key product info section */}
        <div className={styles.keyInfoSection}>
          <div className={styles.priceSection}>
            <ProductDetailItem label="Cena jednostkowa" value={p.cena ? `${p.cena.toFixed(2)} zł` : '-'} />
            {p.cena && (
              <ProductDetailItem 
                label="Cena łączna" 
                value={`${(p.cena * modalQuantity).toFixed(2)} zł`} 
                className={styles.totalPrice}
              />
            )}
          </div>
          <div className={styles.cartControlsContainer}>
            <QuantityControlModal 
              productId={productId} 
              initialQuantity={modalQuantity} 
              onQuantityChange={handleModalQuantityChange} 
            /> 
            <button onClick={handleAddToCart} className={styles.addToCartButton}>Dodaj do koszyka</button>
          </div>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.detailsSection}>
            <div className={styles.detailsColumn}>
              <h4 className={styles.sectionHeader}>Informacje podstawowe</h4>
              <ProductDetailItem label="Nazwa" value={p.nazwa} />
              <ProductDetailItem label="Rodzaj produktu" value={p.rodzajProduktuNazwa} />
              <ProductDetailItem label="Nadkategoria" value={p.nadKategoriaNazwa} />
              <ProductDetailItem label="Waga" value={p.waga ? `${p.waga} kg` : '-'} />
              <ProductDetailItem label="Jednostka" value={p.jednostkaNazwa} />
              <ProductDetailItem label="Opakowanie" value={p.opakowanieNazwa} />
              <ProductDetailItem label="Stawka VAT" value={p.stawkaVatNazwa ? `${p.stawkaVatNazwa}` : (p.stawkaVatWartosc ? `${p.stawkaVatWartosc}%` : '-')} />
              {p.skladniki && p.skladniki.length > 0 && (
                <ProductDetailItem label="Składniki" value={p.skladniki.map(s => s.nazwa).join(', ')} />
              )}
            </div>
            
            <div className={styles.detailsColumn}>
              <h4 className={styles.sectionHeader}>Dostępność</h4>
              <ProductDetailItem label="Dostępny" value={formatBoolean(p.dostepny)} />
              <ProductDetailItem label="Dostępny od ręki" value={formatBoolean(p.dostepneOdReki)} />
              <ProductDetailItem label="Dostępny do 7 dni" value={formatBoolean(p.dostepneDo7Dni)} />
              <ProductDetailItem label="Dostępny na zamówienie" value={formatBoolean(p.dostepneNaZamowienie)} />
              
              <h4 className={styles.sectionHeader}>Oznaczenia</h4>
              <ProductDetailItem label="Super produkt" value={formatBoolean(p.superProdukt)} />
              <ProductDetailItem label="Towar polecany" value={formatBoolean(p.towarPolecany)} />
              <ProductDetailItem label="Rekomendacja sprzedawcy" value={formatBoolean(p.rekomendacjaSprzedawcy)} />
              <ProductDetailItem label="Super cena" value={formatBoolean(p.superCena)} />
              <ProductDetailItem label="Nowość" value={formatBoolean(p.nowosc)} />
              <ProductDetailItem label="Super jakość" value={formatBoolean(p.superjakosc)} />
              <ProductDetailItem label="Bezglutenowy" value={formatBoolean(p.bezglutenowy)} />
            </div>
          </div>
          
          <div className={styles.additionalDetailsSection}>
            <h4 className={styles.sectionHeader}>Informacje dodatkowe</h4>
            <ProductDetailItem label="Kod EAN" value={p.kodEanKod} />
            <ProductDetailItem label="Kod towaru" value={p.kodTowaruKod} />
            <ProductDetailItem label="Identyfikator" value={p.identyfikatorWartosc} />
            <ProductDetailItem label="Skrót jednostki" value={p.jednostkaSkrot} />
            <ProductDetailItem label="Skrót opakowania" value={p.opakowanieSkrot} />
            <ProductDetailItem label="Opis opakowania" value={p.opakowanieOpis} />
            <ProductDetailItem label="Opis rodzaju produktu" value={p.rodzajProduktuOpis} />
            <ProductDetailItem label="Opis nadkategorii" value={p.nadKategoriaOpis} />
            <ProductDetailItem label="Kolejność nadkategorii" value={p.nadKategoriaKolejnosc} />
            {p.pkwiU && <ProductDetailItem label="PKWiU" value={p.pkwiU} />}
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
