import React, { useState, useCallback } from 'react';
import styles from './ProductForm.module.css';
import ImageUploadManager from './components/ImageUploadManager';
import DropdownField from '../../../../../../shared/components/DropdownField/DropdownField';
import {
  fetchRodzajeProduktu,
  fetchJednostki,
  fetchNadKategorie,
  fetchOpakowania,
  fetchStawkiVat
} from '../../../../../../shared/services/apiService';

const ProductForm = ({ onClose }) => {
  const initialFormData = {
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
    // Fields for dropdown selection (will store IDs or direct values)
    rodzajProduktuId: '', 
    jednostkaId: '',
    nadKategoriaId: '',
    opakowanieId: '',
    stawkaVatId: '', // Can store ID if needed, or direct value in stawkaVatWartosc
    // Fields to be populated based on dropdown selection for the payload
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
    stawkaVatWartosc: 0, // Will store the actual VAT rate value

    kodTowaruKod: '',
    kodEanKod: '',
    identyfikatorWartosc: '',
    skladniki: [],
    zdjecia: []
  };
  const [formData, setFormData] = useState(initialFormData);

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

  const handleDropdownChange = (fieldName, selectedOption, eventTargetName) => {
    setFormData(prev => {
      let updatedFields = {};
      switch (fieldName) {
        case 'rodzajProduktu':
          updatedFields = {
            rodzajProduktuId: selectedOption ? selectedOption.id : '',
            rodzajProduktuNazwa: selectedOption ? selectedOption.nazwa : '',
            rodzajProduktuOpis: selectedOption ? selectedOption.opis : ''
          };
          break;
        case 'jednostka':
          updatedFields = {
            jednostkaId: selectedOption ? selectedOption.id : '',
            jednostkaNazwa: selectedOption ? selectedOption.nazwa : '',
            jednostkaSkrot: selectedOption ? selectedOption.skrot : ''
          };
          break;
        case 'nadKategoria':
          updatedFields = {
            nadKategoriaId: selectedOption ? selectedOption.id : '',
            nadKategoriaNazwa: selectedOption ? selectedOption.nazwa : '',
            nadKategoriaOpis: selectedOption ? selectedOption.opis : '',
            nadKategoriaKolejnosc: selectedOption ? selectedOption.kolejnosc : 0
          };
          break;
        case 'opakowanie':
          updatedFields = {
            opakowanieId: selectedOption ? selectedOption.id : '',
            opakowanieNazwa: selectedOption ? selectedOption.nazwa : '',
            opakowanieSkrot: selectedOption ? selectedOption.skrot : '',
            opakowanieOpis: selectedOption ? selectedOption.opis : ''
          };
          break;
        case 'stawkaVat':
          updatedFields = {
            stawkaVatId: selectedOption ? selectedOption.id : '', // Store ID if needed
            stawkaVatWartosc: selectedOption ? parseFloat(selectedOption.wartosc) : 0, // Store the actual VAT rate
            // If the dropdown's 'name' prop was 'stawkaVatWartosc', this ensures it's updated if needed
            // However, we are using 'stawkaVatId' as the name for the select element now.
          };
          break;
        default:
          break;
      }
      return { ...prev, ...updatedFields };
    });
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

  const handleImagesChange = useCallback((newImages) => {
    setFormData(prev => ({
      ...prev,
      zdjecia: newImages
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
      
      const payload = {
        nazwa: formData.nazwa,
        waga: parseFloat(formData.waga) || 0,
        cena: parseFloat(formData.cena) || 0,
        superProdukt: formData.superProdukt,
        towarPolecany: formData.towarPolecany,
        rekomendacjaSprzedawcy: formData.rekomendacjaSprzedawcy,
        superCena: formData.superCena,
        nowosc: formData.nowosc,
        superjakosc: formData.superjakosc,
        rabat: formData.rabat,
        dostepny: formData.dostepny,
        dostepneOdReki: formData.dostepneOdReki,
        dostepneDo7Dni: formData.dostepneDo7Dni,
        dostepneNaZamowienie: formData.dostepneNaZamowienie,
        wartoKupic: formData.wartoKupic,
        bezglutenowy: formData.bezglutenowy,
        opis: formData.opis,
        rodzajProduktu: {
            nazwa: formData.rodzajProduktuNazwa,
            opis: formData.rodzajProduktuOpis
        },
        jednostka: {
            nazwa: formData.jednostkaNazwa,
            skrot: formData.jednostkaSkrot
        },
        nadKategoria: {
            nazwa: formData.nadKategoriaNazwa,
            opis: formData.nadKategoriaOpis,
            kolejnosc: parseInt(formData.nadKategoriaKolejnosc, 10) || 0
        },
        opakowanie: {
            nazwa: formData.opakowanieNazwa,
            skrot: formData.opakowanieSkrot,
            opis: formData.opakowanieOpis
        },
        stawkaVat: {
            wartosc: parseFloat(formData.stawkaVatWartosc) || 0 
        },
        kodTowaru: { kod: formData.kodTowaruKod }, // Assuming backend expects object structure
        kodEan: { kod: formData.kodEanKod }, // Assuming backend expects object structure
        identyfikator: { wartosc: formData.identyfikatorWartosc }, // Assuming backend expects object structure
        skladniki: formData.skladniki.map(s => ({ nazwa: s })), // Assuming backend expects list of objects
        zdjecia: formData.zdjecia.map(({ id, ...restOfImage }) => ({
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

        <DropdownField
          label="Rodzaj Produktu"
          name="rodzajProduktuId" 
          value={formData.rodzajProduktuId}
          onChange={(e, selectedOption) => handleDropdownChange('rodzajProduktu', selectedOption, e.target.name)}
          fetchDataFunction={fetchRodzajeProduktu}
          optionValueKey="id"
          optionLabelKey="nazwa"
          required
        />

        <DropdownField
          label="Jednostka"
          name="jednostkaId"
          value={formData.jednostkaId}
          onChange={(e, selectedOption) => handleDropdownChange('jednostka', selectedOption, e.target.name)}
          fetchDataFunction={fetchJednostki}
          optionValueKey="id"
          optionLabelKey="nazwa"
          required
        />

        <DropdownField
          label="Nadkategoria"
          name="nadKategoriaId"
          value={formData.nadKategoriaId}
          onChange={(e, selectedOption) => handleDropdownChange('nadKategoria', selectedOption, e.target.name)}
          fetchDataFunction={fetchNadKategorie}
          optionValueKey="id"
          optionLabelKey="nazwa"
          required
        />

        <DropdownField
          label="Opakowanie"
          name="opakowanieId"
          value={formData.opakowanieId}
          onChange={(e, selectedOption) => handleDropdownChange('opakowanie', selectedOption, e.target.name)}
          fetchDataFunction={fetchOpakowania}
          optionValueKey="id"
          optionLabelKey="nazwa"
          required
        />

        <DropdownField
          label="Stawka VAT (%)"
          name="stawkaVatId" // Using stawkaVatId for the select, value will be the ID from API
          value={formData.stawkaVatId} // formData.stawkaVatId will store the ID of the selected VAT rate
          onChange={(e, selectedOption) => handleDropdownChange('stawkaVat', selectedOption, e.target.name)}
          fetchDataFunction={fetchStawkiVat}
          optionValueKey="id" // API returns {id, nazwa, wartosc}, so ID is the value for the select
          optionLabelKey="nazwa" // Display name like "VAT 23%"
          required
        />

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

