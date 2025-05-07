import React, { useState, useCallback, useEffect } from 'react';
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
    rodzajProduktuNazwa: '', // This will be controlled by DropdownField, value will be the ID
    rodzajProduktuOpis: '', // Hidden, autofilled
    jednostkaNazwa: '', // This will be controlled by DropdownField, value will be the ID
    jednostkaSkrot: '', // Hidden, autofilled
    nadKategoriaNazwa: '', // This will be controlled by DropdownField, value will be the ID
    nadKategoriaOpis: '', // Hidden, autofilled
    nadKategoriaKolejnosc: 0, // Hidden, autofilled
    opakowanieNazwa: '', // This will be controlled by DropdownField, value will be the ID
    opakowanieSkrot: '', // Hidden, autofilled
    opakowanieOpis: '', // Hidden, autofilled
    stawkaVatWartosc: '', // This will be controlled by DropdownField, value will be the ID (or value directly if simple)
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
      [name]: type === 'checkbox' ? checked : type === 'number' && name !== 'stawkaVatWartosc' ? parseFloat(value) : value
    }));
  };

  const setRodzajProduktuHiddenFields = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      rodzajProduktuOpis: selectedOption ? selectedOption.opis : ''
    }));
  };

  const setJednostkaHiddenFields = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      jednostkaSkrot: selectedOption ? selectedOption.skrot : ''
    }));
  };

  const setNadKategoriaHiddenFields = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      nadKategoriaOpis: selectedOption ? selectedOption.opis : '',
      nadKategoriaKolejnosc: selectedOption ? selectedOption.kolejnosc : 0
    }));
  };

  const setOpakowanieHiddenFields = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      opakowanieSkrot: selectedOption ? selectedOption.skrot : '',
      opakowanieOpis: selectedOption ? selectedOption.opis : ''
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
      
      // Prepare payload for the API
      // The dropdowns will store the ID of the selected item in their respective 'Nazwa' fields (e.g., rodzajProduktuNazwa will be an ID)
      // The backend expects the full objects or specific fields based on the selected IDs.
      // For simplicity in this example, we'll assume the backend can handle IDs for these fields, 
      // or that a transformation step (not fully shown here for brevity) would map these IDs back to objects or required structures.
      // The current formData for these fields (e.g. rodzajProduktuNazwa) will hold the ID.
      // The hidden fields (e.g. rodzajProduktuOpis) are already updated in formData.

      const payload = {
        ...formData,
        // Ensure numeric fields are numbers if they were changed by dropdowns storing IDs as strings
        waga: parseFloat(formData.waga) || 0,
        cena: parseFloat(formData.cena) || 0,
        // stawkaVatWartosc might be an ID or a value, adjust as per API expectation
        // For now, assuming it's a value if it's simple, or an ID if it's an object from DB
        // If stawkaVatWartosc is an ID, the backend needs to look up the actual value.
        // If it's a direct value (e.g. 23 for 23%), then it's fine.
        // Let's assume for StawkaVAT, the value itself is what's needed, not an ID.
        // The cURL for Stawka VAT implies it returns objects like {id, nazwa, wartosc}
        // So, stawkaVatWartosc in formData should be the 'wartosc' from the selected option.

        // The dropdown for Stawka VAT will store the 'wartosc' directly in 'stawkaVatWartosc'
        // For other dropdowns, we are storing the ID in the '...Nazwa' field.
        // We need to adjust the payload to send the correct structure to the backend.
        // This part needs careful mapping based on what the backend expects for each field.

        // Example: if backend expects an object for rodzajProduktu:
        // rodzajProduktu: { id: formData.rodzajProduktuNazwa, opis: formData.rodzajProduktuOpis, nazwa: /* need to get this from selected option */ },
        // For now, we'll send the IDs and the autofilled hidden fields.
        // The user prompt mentioned: "pola w formularzu muszą się zaktualizować o wybrane dane tak jak bylo dotychczas tylko że wpisywane manualnie"
        // This implies the formData should contain the actual values, not just IDs for related entities.
        // So, the DropdownField's onChange and setHiddenFields need to ensure all relevant fields in formData are set.

        // Corrected payload structure based on the assumption that formData holds the final values:
        rodzajProduktu: {
            nazwa: formData.rodzajProduktuNazwa, // This should be the actual name, not ID
            opis: formData.rodzajProduktuOpis
        },
        jednostka: {
            nazwa: formData.jednostkaNazwa, // Actual name
            skrot: formData.jednostkaSkrot
        },
        nadKategoria: {
            nazwa: formData.nadKategoriaNazwa, // Actual name
            opis: formData.nadKategoriaOpis,
            kolejnosc: parseInt(formData.nadKategoriaKolejnosc, 10) || 0
        },
        opakowanie: {
            nazwa: formData.opakowanieNazwa, // Actual name
            skrot: formData.opakowanieSkrot,
            opis: formData.opakowanieOpis
        },
        stawkaVat: {
             // Assuming stawkaVatWartosc in formData will hold the actual numeric VAT rate (e.g., 23)
            wartosc: parseFloat(formData.stawkaVatWartosc) || 0 
        },
        zdjecia: formData.zdjecia.map(({ id, ...restOfImage }) => ({
            daneZdjecia: restOfImage.daneZdjecia,
            opis: restOfImage.opis,
            kolejnosc: restOfImage.kolejnosc
        }))
      };
      
      // Remove the individual fields from payload that are now part of nested objects
      delete payload.rodzajProduktuNazwa;
      delete payload.rodzajProduktuOpis;
      delete payload.jednostkaNazwa;
      delete payload.jednostkaSkrot;
      delete payload.nadKategoriaNazwa;
      delete payload.nadKategoriaOpis;
      delete payload.nadKategoriaKolejnosc;
      delete payload.opakowanieNazwa;
      delete payload.opakowanieSkrot;
      delete payload.opakowanieOpis;
      // stawkaVatWartosc is handled by creating stawkaVat.wartosc
      // delete payload.stawkaVatWartosc; // Keep this if the backend expects it directly and not nested.
                                        // Based on the requirement to update fields as before, we'll assume the backend expects the nested structure.
                                        // If not, this needs adjustment.

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
          name="rodzajProduktuNazwa" // This field in formData will store the ID of the selected rodzajProduktu
          value={formData.rodzajProduktuNazwa} // This should be the ID
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedOption = e.target.options[e.target.selectedIndex].text; // Get the display name
            setFormData(prev => ({...prev, rodzajProduktuNazwa: selectedOption })); // Store actual name for display/payload
          }}
          fetchDataFunction={fetchRodzajeProduktu}
          optionValueKey="id" // Assuming API returns { id: ..., nazwa: ..., opis: ... }
          optionLabelKey="nazwa"
          setHiddenFields={(selectedOption) => {
            setFormData(prev => ({
              ...prev,
              rodzajProduktuOpis: selectedOption ? selectedOption.opis : initialFormData.rodzajProduktuOpis,
              // Update rodzajProduktuNazwa to the actual name if it's not already done by onChange
              rodzajProduktuNazwa: selectedOption ? selectedOption.nazwa : initialFormData.rodzajProduktuNazwa
            }));
          }}
          initialFormData={initialFormData}
        />

        <DropdownField
          label="Jednostka"
          name="jednostkaNazwa" // This field in formData will store the ID
          value={formData.jednostkaNazwa} // This should be the ID
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedOption = e.target.options[e.target.selectedIndex].text;
            setFormData(prev => ({...prev, jednostkaNazwa: selectedOption }));
          }}
          fetchDataFunction={fetchJednostki}
          optionValueKey="id" // Assuming API returns { id: ..., nazwa: ..., skrot: ... }
          optionLabelKey="nazwa"
          setHiddenFields={(selectedOption) => {
            setFormData(prev => ({
              ...prev,
              jednostkaSkrot: selectedOption ? selectedOption.skrot : initialFormData.jednostkaSkrot,
              jednostkaNazwa: selectedOption ? selectedOption.nazwa : initialFormData.jednostkaNazwa
            }));
          }}
          initialFormData={initialFormData}
        />

        <DropdownField
          label="Nadkategoria"
          name="nadKategoriaNazwa" // This field in formData will store the ID
          value={formData.nadKategoriaNazwa} // This should be the ID
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedOption = e.target.options[e.target.selectedIndex].text;
            setFormData(prev => ({...prev, nadKategoriaNazwa: selectedOption }));
          }}
          fetchDataFunction={fetchNadKategorie}
          optionValueKey="id" // Assuming API returns { id: ..., nazwa: ..., opis: ..., kolejnosc: ... }
          optionLabelKey="nazwa"
          setHiddenFields={(selectedOption) => {
            setFormData(prev => ({
              ...prev,
              nadKategoriaOpis: selectedOption ? selectedOption.opis : initialFormData.nadKategoriaOpis,
              nadKategoriaKolejnosc: selectedOption ? selectedOption.kolejnosc : initialFormData.nadKategoriaKolejnosc,
              nadKategoriaNazwa: selectedOption ? selectedOption.nazwa : initialFormData.nadKategoriaNazwa
            }));
          }}
          initialFormData={initialFormData}
        />

        <DropdownField
          label="Opakowanie"
          name="opakowanieNazwa" // This field in formData will store the ID
          value={formData.opakowanieNazwa} // This should be the ID
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedOption = e.target.options[e.target.selectedIndex].text;
            setFormData(prev => ({...prev, opakowanieNazwa: selectedOption }));
          }}
          fetchDataFunction={fetchOpakowania}
          optionValueKey="id" // Assuming API returns { id: ..., nazwa: ..., skrot: ..., opis: ... }
          optionLabelKey="nazwa"
          setHiddenFields={(selectedOption) => {
            setFormData(prev => ({
              ...prev,
              opakowanieSkrot: selectedOption ? selectedOption.skrot : initialFormData.opakowanieSkrot,
              opakowanieOpis: selectedOption ? selectedOption.opis : initialFormData.opakowanieOpis,
              opakowanieNazwa: selectedOption ? selectedOption.nazwa : initialFormData.opakowanieNazwa
            }));
          }}
          initialFormData={initialFormData}
        />

        <DropdownField
          label="Stawka VAT (%)"
          name="stawkaVatWartosc" // This field in formData will store the selected VAT value (e.g., 23)
          value={formData.stawkaVatWartosc}
          onChange={(e) => {
             // For Stawka VAT, the value itself is what we want to store
            const selectedValue = e.target.value;
            setFormData(prev => ({...prev, stawkaVatWartosc: selectedValue ? parseFloat(selectedValue) : initialFormData.stawkaVatWartosc }));
          }}
          fetchDataFunction={fetchStawkiVat}
          optionValueKey="wartosc" // Assuming API returns { id: ..., nazwa: ..., wartosc: ... }
          optionLabelKey="nazwa" // Display name like "VAT 23%"
          // No hidden fields for Stawka VAT as per requirements, it's a direct value.
          // setHiddenFields can be omitted or passed as null/undefined if not needed by DropdownField
          initialFormData={initialFormData}
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

        {/* Hidden fields are now managed by setHiddenFields in DropdownField and are part of formData */}
        {/* No need to render them as inputs anymore */}

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

