import React from 'react';
import styles from './ProductRow.module.css';
import QuantityControl from './components/QuantityControl'; // Will create this next

const ProductRow = ({ productItem }) => {
  const { produkt, zdjecia } = productItem;

  // Display only the first image, if available
  const firstImage = zdjecia && zdjecia.length > 0 ? zdjecia[0] : null;
  const imageUrl = firstImage && firstImage.daneZdjecia 
    ? `data:image/jpeg;base64,${firstImage.daneZdjecia}` 
    : 'https://via.placeholder.com/80'; // Placeholder if no image

  const displayPrice = produkt.jednostkaNazwa 
    ? `${(produkt.cena / 100).toFixed(2)} / ${produkt.jednostkaNazwa}` 
    : `${(produkt.cena / 100).toFixed(2)}`;

  return (
    <tr className={styles.productRow}>
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
      <td>{displayPrice}</td>
      <td>
        <QuantityControl productId={produkt.id} />
      </td>
    </tr>
  );
};

export default ProductRow;

