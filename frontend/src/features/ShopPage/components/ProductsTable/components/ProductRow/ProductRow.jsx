import React from 'react';
import styles from './ProductRow.module.css';
import QuantityControl from './components/QuantityControl';

const ProductRow = ({ productItem, onRowClick }) => {
  const { produkt, zdjecia } = productItem;

  const firstImage = zdjecia && zdjecia.length > 0 ? zdjecia[0] : null;
  const imageUrl = firstImage && firstImage.daneZdjecia 
    ? `data:image/jpeg;base64,${firstImage.daneZdjecia}` 
    : 'https://via.placeholder.com/80';

  const rawPrice = produkt.cena;

  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(productItem);
    }
  };

  // Prepare product details for CartContext
  const productDetailsForCart = {
    id: produkt.id,
    nazwa: produkt.nazwa,
    cena: produkt.cena, // Ensure this is the unit price
    // zdjecieUrl: imageUrl // Optional, as per cart_design.md
  };

  return (
    <tr className={styles.productRow} onClick={handleRowClick}>
      <td>{produkt.kodEanKod || '-'}</td>
      <td>
        <img 
          src={imageUrl} 
          alt={produkt.nazwa || 'Zdjęcie produktu'} 
          className={styles.productImage} 
        />
      </td>
      <td>{produkt.nazwa || '-'}</td>
      <td>{produkt.rodzajProduktuNazwa || '-'}</td>
      <td>{produkt.dostepny ? 'Tak' : 'Nie'}</td>
      <td>{rawPrice !== null && rawPrice !== undefined ? rawPrice.toFixed(2) : '-'}</td> {/* Ensure price is formatted */} 
      <td>
        {/* Pass productDetailsForCart to QuantityControl */}
        <QuantityControl product={productDetailsForCart} />
      </td>
    </tr>
  );
};

export default ProductRow;
