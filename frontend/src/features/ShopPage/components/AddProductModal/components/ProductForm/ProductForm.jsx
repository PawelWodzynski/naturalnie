import React, { useState, useCallback } from 'react';
import styles from './ProductForm.module.css';
import ImageUploadManager from './components/ImageUploadManager';

const ProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nazwa: '',
    waga: 0,
    cena: 0,
    superProdukt: false,
    towarPolecany: false,
    rekomendacjaSprzedawcy: false,
    superCena: false,
    nowosc: false,
    superjakosc: false,
    rabat: false,
    dostepny: true,
    dostepneOdReki: true,
    dostepneDo7Dni: false,
    dostepneNaZamowienie: false,
    wartoKupic: false,
    bezglutenowy: false,
    opis: '',
    rodzajProduktuNazwa: '',
    rodzajProduktuOpis: '',
    jednostkaNazwa: '',
    jednostkaSkrot: '',
    nadKategoriaNazwa: '',
    nadKategoriaOpis: '',
    nadKategoriaKolejnosc: 0,
    opakowanieNazwa: '',
    opakowanieSkrot: '',
    opakowanieOpis: '',
    stawkaVatWartosc: 0,
    kodTowaruKod: '',
    kodEanKod: '',
    identyfikatorWartosc: '',
    skladniki: [],
    zdjecia: [] // This will store images with their temporary 'id' for DnD
  });

  const [skladnikInput, setSkladnikInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSkladnikInputChange = (e) => {
    setSkladnikInput(e.target.value);
  };

  const handleAddSkladnik = () => {
    if (skladnikInput.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        skladniki: [...prev.skladniki, skladnikInput.trim()]
      }));
      setSkladnikInput('');
    }
  };

  const handleRemoveSkladnik = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      skladniki: prev.skladniki.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Corrected: Keep the temporary 'id' for images in formData for DnD purposes.
  // The 'id' will be stripped only when preparing the payload for the API.
  const handleImagesChange = useCallback((newImages) => {
    setFormData(prev => ({
      ...prev,
      zdjecia: newImages // Store images with their 'id' and other data
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitError("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
      setIsSubmitting(false);
      return;
    }

    try {
      const encodedToken = encodeURIComponent(token);
      const url = `http://localhost:8080/api/app-data/produkt?token=${encodedToken}`;
      
      // Prepare payload: strip temporary 'id' from zdjecia before sending to API
      const payload = {
        ...formData,
        zdjecia: formData.zdjecia.map(({ id, ...restOfImage }) => ({
            // Ensure only fields expected by the backend are sent
            daneZdjecia: restOfImage.daneZdjecia,
            opis: restOfImage.opis,
            kolejnosc: restOfImage.kolejnosc
        }))
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Nie udało się przetworzyć odpowiedzi błędu serwera.' }));
        throw new Error(`Błąd serwera: ${response.status} - ${errorData.message || 'Nieznany błąd'}`);
      }

      alert('Produkt dodany pomyślnie!');
      onClose();
    } catch (error) {
      console.error("Błąd podczas dodawania produktu:", error);
      setSubmitError(error.message || "Wystąpił nieoczekiwany błąd.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.productForm}>
      {submitError && <div className={styles.errorMessage}>{submitError}</div>}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="nazwa">Nazwa Produktu:</label>
          <input type="text" id="nazwa" name="nazwa" value={formData.nazwa} onChange={handleInputChange} required className={styles.formInput} />
        </div>
        <div className={styles.formGroupFullWidth}>
          <label htmlFor="opis">Opis Produktu:</label>
          <textarea id="opis" name="opis" value={formData.opis} onChange={handleInputChange} rows="4" className={styles.formInput}></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="waga">Waga (kg):</label>
          <input type="number" id="waga" name="waga" value={formData.waga} onChange={handleInputChange} step="0.01" className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cena">Cena (PLN):</label>
          <input type="number" id="cena" name="cena" value={formData.cena} onChange={handleInputChange} step="0.01" className={styles.formInput} />
        </div>
        <div className={styles.formGroupCheckboxesFullWidth}>
            <h4 className={styles.checkboxGroupTitle}>Opcje Produktu:</h4>
            <div className={styles.checkboxGrid}>
                <div className={styles.checkboxItem}><input type="checkbox" id="superProdukt" name="superProdukt" checked={formData.superProdukt} onChange={handleInputChange} /> <label htmlFor="superProdukt">Super Produkt</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="towarPolecany" name="towarPolecany" checked={formData.towarPolecany} onChange={handleInputChange} /> <label htmlFor="towarPolecany">Towar Polecany</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="rekomendacjaSprzedawcy" name="rekomendacjaSprzedawcy" checked={formData.rekomendacjaSprzedawcy} onChange={handleInputChange} /> <label htmlFor="rekomendacjaSprzedawcy">Rekomendacja Sprzedawcy</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="superCena" name="superCena" checked={formData.superCena} onChange={handleInputChange} /> <label htmlFor="superCena">Super Cena</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="nowosc" name="nowosc" checked={formData.nowosc} onChange={handleInputChange} /> <label htmlFor="nowosc">Nowość</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="superjakosc" name="superjakosc" checked={formData.superjakosc} onChange={handleInputChange} /> <label htmlFor="superjakosc">Super Jakość</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="rabat" name="rabat" checked={formData.rabat} onChange={handleInputChange} /> <label htmlFor="rabat">Rabat</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="wartoKupic" name="wartoKupic" checked={formData.wartoKupic} onChange={handleInputChange} /> <label htmlFor="wartoKupic">Warto Kupić</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="bezglutenowy" name="bezglutenowy" checked={formData.bezglutenowy} onChange={handleInputChange} /> <label htmlFor="bezglutenowy">Bezglutenowy</label></div>
            </div>
        </div>
        <div className={styles.formGroupCheckboxesFullWidth}>
            <h4 className={styles.checkboxGroupTitle}>Dostępność:</h4>
            <div className={styles.checkboxGrid}>
                <div className={styles.checkboxItem}><input type="checkbox" id="dostepny" name="dostepny" checked={formData.dostepny} onChange={handleInputChange} /> <label htmlFor="dostepny">Dostępny</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="dostepneOdReki" name="dostepneOdReki" checked={formData.dostepneOdReki} onChange={handleInputChange} /> <label htmlFor="dostepneOdReki">Dostępne od Ręki</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="dostepneDo7Dni" name="dostepneDo7Dni" checked={formData.dostepneDo7Dni} onChange={handleInputChange} /> <label htmlFor="dostepneDo7Dni">Dostępne do 7 Dni</label></div>
                <div className={styles.checkboxItem}><input type="checkbox" id="dostepneNaZamowienie" name="dostepneNaZamowienie" checked={formData.dostepneNaZamowienie} onChange={handleInputChange} /> <label htmlFor="dostepneNaZamowienie">Dostępne na Zamówienie</label></div>
            </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="rodzajProduktuNazwa">Rodzaj Produktu - Nazwa:</label>
          <input type="text" id="rodzajProduktuNazwa" name="rodzajProduktuNazwa" value={formData.rodzajProduktuNazwa} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="rodzajProduktuOpis">Rodzaj Produktu - Opis:</label>
          <input type="text" id="rodzajProduktuOpis" name="rodzajProduktuOpis" value={formData.rodzajProduktuOpis} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="jednostkaNazwa">Jednostka - Nazwa:</label>
          <input type="text" id="jednostkaNazwa" name="jednostkaNazwa" value={formData.jednostkaNazwa} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="jednostkaSkrot">Jednostka - Skrót:</label>
          <input type="text" id="jednostkaSkrot" name="jednostkaSkrot" value={formData.jednostkaSkrot} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nadKategoriaNazwa">Nadkategoria - Nazwa:</label>
          <input type="text" id="nadKategoriaNazwa" name="nadKategoriaNazwa" value={formData.nadKategoriaNazwa} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nadKategoriaOpis">Nadkategoria - Opis:</label>
          <input type="text" id="nadKategoriaOpis" name="nadKategoriaOpis" value={formData.nadKategoriaOpis} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nadKategoriaKolejnosc">Nadkategoria - Kolejność:</label>
          <input type="number" id="nadKategoriaKolejnosc" name="nadKategoriaKolejnosc" value={formData.nadKategoriaKolejnosc} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="opakowanieNazwa">Opakowanie - Nazwa:</label>
          <input type="text" id="opakowanieNazwa" name="opakowanieNazwa" value={formData.opakowanieNazwa} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="opakowanieSkrot">Opakowanie - Skrót:</label>
          <input type="text" id="opakowanieSkrot" name="opakowanieSkrot" value={formData.opakowanieSkrot} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="opakowanieOpis">Opakowanie - Opis:</label>
          <input type="text" id="opakowanieOpis" name="opakowanieOpis" value={formData.opakowanieOpis} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="stawkaVatWartosc">Stawka VAT (%):</label>
          <input type="number" id="stawkaVatWartosc" name="stawkaVatWartosc" value={formData.stawkaVatWartosc} onChange={handleInputChange} step="0.01" className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="kodTowaruKod">Kod Towaru:</label>
          <input type="text" id="kodTowaruKod" name="kodTowaruKod" value={formData.kodTowaruKod} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="kodEanKod">Kod EAN:</label>
          <input type="text" id="kodEanKod" name="kodEanKod" value={formData.kodEanKod} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="identyfikatorWartosc">Identyfikator Wewnętrzny:</label>
          <input type="text" id="identyfikatorWartosc" name="identyfikatorWartosc" value={formData.identyfikatorWartosc} onChange={handleInputChange} className={styles.formInput} />
        </div>
        <div className={styles.formGroupFullWidth}>
          <label htmlFor="skladnikInput">Składniki:</label>
          <div className={styles.skladnikiList}>
            {formData.skladniki.map((skladnik, index) => (
              <div key={index} className={styles.skladnikItem}>
                {skladnik}
                <button type="button" onClick={() => handleRemoveSkladnik(index)} className={styles.removeButton}>Usuń</button>
              </div>
            ))}
          </div>
          <div className={styles.addSkladnikContainer}>
            <input 
              type="text" 
              id="skladnikInput" 
              value={skladnikInput} 
              onChange={handleSkladnikInputChange} 
              placeholder="Dodaj składnik"
              className={styles.formInput}
            />
            <button type="button" onClick={handleAddSkladnik} className={styles.addButton}>Dodaj Składnik</button>
          </div>
        </div>
      </div> 
      <div className={styles.formGroupFullWidth}>
        <label>Zdjęcia Produktu:</label>
        <ImageUploadManager images={formData.zdjecia} onImagesChange={handleImagesChange} />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Dodawanie...' : 'Dodaj Produkt'}
        </button>
        <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Anuluj</button>
      </div>
    </form>
  );
};

export default ProductForm;

