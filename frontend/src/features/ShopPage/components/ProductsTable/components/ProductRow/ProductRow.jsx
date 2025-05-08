import React from 'react';
import styles from './ProductRow.module.css';
import QuantityControl from './components/QuantityControl';

// Accept onRowClick prop
const ProductRow = ({ productItem, onRowClick }) => {
  const { produkt, zdjecia } = productItem;

  const firstImage = zdjecia && zdjecia.length > 0 ? zdjecia[0] : null;
  const imageUrl = firstImage && firstImage.daneZdjecia 
    ? `data:image/jpeg;base64,${firstImage.daneZdjecia}` 
    : 'https://via.placeholder.com/80';

  const displayPrice = produkt.jednostkaNazwa 
    ? `${(produkt.cena / 100).toFixed(2)} / ${produkt.jednostkaNazwa}` 
    : `${(produkt.cena / 100).toFixed(2)}`;

  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(productItem);
    }
  };

  return (
    <tr className={styles.productRow} onClick={handleRowClick}> {/* Add onClick handler to the row */}
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

