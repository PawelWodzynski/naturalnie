import React, { useState, useCallback, useRef } from 'react';
import styles from './ProductForm.module.css';
import ImageUploadManager from './components/ImageUploadManager';
import DropdownField from '../../../../../../shared/components/DropdownField/DropdownField';
import {
  fetchRodzajeProduktu,
  fetchJednostki,
  fetchNadKategorie,
  fetchOpakowania,
  fetchStawkiVat,
  addRodzajProduktu,
  addJednostka,
  addNadKategoria,
  addOpakowanie,
  addStawkaVat
} from '../../../../../../shared/services/apiService';

// Import Add Option Modals
import AddRodzajProduktuModal from './components/addOptionModals/AddRodzajProduktuModal';
import AddJednostkaModal from './components/addOptionModals/AddJednostkaModal';
import AddNadKategoriaModal from './components/addOptionModals/AddNadKategoriaModal';
import AddOpakowanieModal from './components/addOptionModals/AddOpakowanieModal';
import AddStawkaVatModal from './components/addOptionModals/AddStawkaVatModal';

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
    rodzajProduktuId: '', 
    jednostkaId: '',
    nadKategoriaId: '',
    opakowanieId: '',
    stawkaVatId: '',
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
    zdjecia: []
  };
  const [formData, setFormData] = useState(initialFormData);
  const [skladnikInput, setSkladnikInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [activeAddOptionModal, setActiveAddOptionModal] = useState({ type: null, isOpen: false });

  // Refs for DropdownFields to call their refreshAndSelect method
  const rodzajProduktuDropdownRef = useRef(null);
  const jednostkaDropdownRef = useRef(null);
  const nadKategoriaDropdownRef = useRef(null);
  const opakowanieDropdownRef = useRef(null);
  const stawkaVatDropdownRef = useRef(null);

  const dropdownRefs = {
    rodzajProduktu: rodzajProduktuDropdownRef,
    jednostka: jednostkaDropdownRef,
    nadKategoria: nadKategoriaDropdownRef,
    opakowanie: opakowanieDropdownRef,
    stawkaVat: stawkaVatDropdownRef
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' && name !== 'stawkaVatWartosc') ? parseFloat(value) : value
    }));
  };

  const handleDropdownChange = (dropdownName, selectedOption) => {
    setFormData(prev => {
      let updatedFields = {};
      if (selectedOption) {
        switch (dropdownName) {
          case 'rodzajProduktu':
            updatedFields = {
              rodzajProduktuId: selectedOption.id,
              rodzajProduktuNazwa: selectedOption.nazwa,
              rodzajProduktuOpis: selectedOption.opis
            };
            break;
          case 'jednostka':
            updatedFields = {
              jednostkaId: selectedOption.id,
              jednostkaNazwa: selectedOption.nazwa,
              jednostkaSkrot: selectedOption.skrot
            };
            break;
          case 'nadKategoria':
            updatedFields = {
              nadKategoriaId: selectedOption.id,
              nadKategoriaNazwa: selectedOption.nazwa,
              nadKategoriaOpis: selectedOption.opis,
              nadKategoriaKolejnosc: selectedOption.kolejnosc
            };
            break;
          case 'opakowanie':
            updatedFields = {
              opakowanieId: selectedOption.id,
              opakowanieNazwa: selectedOption.nazwa,
              opakowanieSkrot: selectedOption.skrot,
              opakowanieOpis: selectedOption.opis
            };
            break;
          case 'stawkaVat':
            updatedFields = {
              stawkaVatId: selectedOption.id,
              stawkaVatWartosc: parseFloat(selectedOption.wartosc)
            };
            break;
          default:
            break;
        }
      } else { // Clear fields if selectedOption is null (e.g. clearing selection)
        switch (dropdownName) {
            case 'rodzajProduktu': updatedFields = { rodzajProduktuId: '', rodzajProduktuNazwa: '', rodzajProduktuOpis: '' }; break;
            case 'jednostka': updatedFields = { jednostkaId: '', jednostkaNazwa: '', jednostkaSkrot: '' }; break;
            case 'nadKategoria': updatedFields = { nadKategoriaId: '', nadKategoriaNazwa: '', nadKategoriaOpis: '', nadKategoriaKolejnosc: 0 }; break;
            case 'opakowanie': updatedFields = { opakowanieId: '', opakowanieNazwa: '', opakowanieSkrot: '', opakowanieOpis: '' }; break;
            case 'stawkaVat': updatedFields = { stawkaVatId: '', stawkaVatWartosc: 0 }; break;
            default: break;
        }
      }
      return { ...prev, ...updatedFields };
    });
  };

  const handleOpenAddOptionModal = (entityType) => {
    setActiveAddOptionModal({ type: entityType, isOpen: true });
  };

  const handleCloseAddOptionModal = () => {
    setActiveAddOptionModal({ type: null, isOpen: false });
  };

  const handleOptionSuccessfullyAdded = (newlyAddedOption, entityType) => {
    if (newlyAddedOption && entityType) {
      // 1. Update the main form data by simulating a dropdown change
      handleDropdownChange(entityType, newlyAddedOption);
      
      // 2. Trigger the relevant DropdownField to refresh its options and select the new one
      const dropdownRef = dropdownRefs[entityType];
      if (dropdownRef && dropdownRef.current && typeof dropdownRef.current.refreshAndSelect === 'function') {
        dropdownRef.current.refreshAndSelect(newlyAddedOption);
      } else {
        console.warn(`Dropdown ref or refreshAndSelect method not found for ${entityType}`);
        // As a fallback, you might just re-fetch all options for that dropdown if the ref method fails
      }
    }
    handleCloseAddOptionModal();
  };

  const handleSkladnikInputChange = (e) => setSkladnikInput(e.target.value);

  const handleAddSkladnik = () => {
    if (skladnikInput.trim() !== '') {
      setFormData(prev => ({ ...prev, skladniki: [...prev.skladniki, skladnikInput.trim()] }));
      setSkladnikInput('');
    }
  };

  const handleRemoveSkladnik = (indexToRemove) => {
    setFormData(prev => ({ ...prev, skladniki: prev.skladniki.filter((_, index) => index !== indexToRemove) }));
  };

  const handleImagesChange = useCallback((newImages) => {
    setFormData(prev => ({ ...prev, zdjecia: newImages }));
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
        rodzajProduktuNazwa: formData.rodzajProduktuNazwa,
        rodzajProduktuOpis: formData.rodzajProduktuOpis,
        jednostkaNazwa: formData.jednostkaNazwa,
        jednostkaSkrot: formData.jednostkaSkrot,
        nadKategoriaNazwa: formData.nadKategoriaNazwa,
        nadKategoriaOpis: formData.nadKategoriaOpis,
        nadKategoriaKolejnosc: parseInt(formData.nadKategoriaKolejnosc, 10) || 0,
        opakowanieNazwa: formData.opakowanieNazwa,
        opakowanieSkrot: formData.opakowanieSkrot,
        opakowanieOpis: formData.opakowanieOpis,
        stawkaVatWartosc: parseFloat(formData.stawkaVatWartosc) || 0,
        kodTowaruKod: formData.kodTowaruKod,
        kodEanKod: formData.kodEanKod,
        identyfikatorWartosc: formData.identyfikatorWartosc,
        skladniki: formData.skladniki,
        zdjecia: formData.zdjecia.map(img => ({ daneZdjecia: img.daneZdjecia, opis: img.opis, kolejnosc: img.kolejnosc }))
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Nie udało się przetworzyć odpowiedzi błędu serwera.' }));
        throw new Error(`Błąd serwera: ${response.status} - ${errorData.message || 'Nieznany błąd'}`);
      }
      alert('Produkt dodany pomyślnie!');
      onClose();
    } catch (error) {
      setSubmitError(error.message || "Wystąpił nieoczekiwany błąd.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
            onChange={(e, selectedOption) => handleDropdownChange('rodzajProduktu', selectedOption)}
            fetchDataFunction={fetchRodzajeProduktu}
            optionValueKey="id"
            optionLabelKey="nazwa"
            required
            entityType="rodzajProduktu"
            onOpenAddModal={handleOpenAddOptionModal}
            onOptionAdded={(refMethods) => { rodzajProduktuDropdownRef.current = refMethods; }}
          />

          <DropdownField
            label="Jednostka"
            name="jednostkaId"
            value={formData.jednostkaId}
            onChange={(e, selectedOption) => handleDropdownChange('jednostka', selectedOption)}
            fetchDataFunction={fetchJednostki}
            optionValueKey="id"
            optionLabelKey="nazwa"
            required
            entityType="jednostka"
            onOpenAddModal={handleOpenAddOptionModal}
            onOptionAdded={(refMethods) => { jednostkaDropdownRef.current = refMethods; }}
          />

          <DropdownField
            label="Nadkategoria"
            name="nadKategoriaId"
            value={formData.nadKategoriaId}
            onChange={(e, selectedOption) => handleDropdownChange('nadKategoria', selectedOption)}
            fetchDataFunction={fetchNadKategorie}
            optionValueKey="id"
            optionLabelKey="nazwa"
            required
            entityType="nadKategoria"
            onOpenAddModal={handleOpenAddOptionModal}
            onOptionAdded={(refMethods) => { nadKategoriaDropdownRef.current = refMethods; }}
          />

          <DropdownField
            label="Opakowanie"
            name="opakowanieId"
            value={formData.opakowanieId}
            onChange={(e, selectedOption) => handleDropdownChange('opakowanie', selectedOption)}
            fetchDataFunction={fetchOpakowania}
            optionValueKey="id"
            optionLabelKey="nazwa"
            required
            entityType="opakowanie"
            onOpenAddModal={handleOpenAddOptionModal}
            onOptionAdded={(refMethods) => { opakowanieDropdownRef.current = refMethods; }}
          />

          <DropdownField
            label="Stawka VAT (%)"
            name="stawkaVatId"
            value={formData.stawkaVatId}
            onChange={(e, selectedOption) => handleDropdownChange('stawkaVat', selectedOption)}
            fetchDataFunction={fetchStawkiVat}
            optionValueKey="id"
            optionLabelKey="wartosc"
            required
            entityType="stawkaVat"
            onOpenAddModal={handleOpenAddOptionModal}
            onOptionAdded={(refMethods) => { stawkaVatDropdownRef.current = refMethods; }}
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
          <label htmlFor="identyfikatorWartosc">Identyfikator:</label>
          <input type="text" id="identyfikatorWartosc" name="identyfikatorWartosc" value={formData.identyfikatorWartosc} onChange={handleInputChange} className={styles.formInput} />
        </div>

        <div className={styles.formGroupFullWidth}>
          <label htmlFor="skladnikInput">Składniki (dodaj pojedynczo):</label>
          <div className={styles.inputWithButton}>
            <input type="text" id="skladnikInput" value={skladnikInput} onChange={handleSkladnikInputChange} className={styles.formInput} />
            <button type="button" onClick={handleAddSkladnik} className={styles.addButtonSkladnik}>Dodaj Składnik</button>
          </div>
          <ul className={styles.skladnikiList}>
            {formData.skladniki.map((skladnik, index) => (
              <li key={index} className={styles.skladnikItem}>
                {skladnik}
                <button type="button" onClick={() => handleRemoveSkladnik(index)} className={styles.removeButtonSkladnik}>Usuń</button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.formGroupFullWidth}>
            <ImageUploadManager onImagesChange={handleImagesChange} currentImages={formData.zdjecia} />
        </div>

        </div>
        <div className={styles.formActionsMain}>
          <button type="submit" className={styles.submitButtonMain} disabled={isSubmitting}>
            {isSubmitting ? 'Dodawanie Produktu...' : 'Dodaj Produkt'}
          </button>
          <button type="button" onClick={onClose} className={styles.cancelButtonMain} disabled={isSubmitting}>
            Anuluj
          </button>
        </div>
      </form>

      {/* Render Add Option Modals */}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'rodzajProduktu' && (
        <AddRodzajProduktuModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={handleOptionSuccessfullyAdded}
          apiAddFunction={addRodzajProduktu}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'jednostka' && (
        <AddJednostkaModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={handleOptionSuccessfullyAdded}
          apiAddFunction={addJednostka}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'nadKategoria' && (
        <AddNadKategoriaModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={handleOptionSuccessfullyAdded}
          apiAddFunction={addNadKategoria}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'opakowanie' && (
        <AddOpakowanieModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={handleOptionSuccessfullyAdded}
          apiAddFunction={addOpakowanie}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'stawkaVat' && (
        <AddStawkaVatModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={handleOptionSuccessfullyAdded}
          apiAddFunction={addStawkaVat}
        />
      )}
    </>
  );
};

export default ProductForm;

