import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './ProductForm.module.css';
import ImageUploadManager from './components/ImageUploadManager';
import DropdownField from '../../../../../../shared/components/DropdownField/DropdownField';
// Removed SkladnikiDropdownField import as it's now part of IngredientsSection
import InfoModal from '../../../../../../shared/components/InfoModal';
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

// Import new section components
import BasicProductInfoSection from './components/BasicProductInfoSection';
import ProductOptionsCheckboxesSection from './components/ProductOptionsCheckboxesSection';
import AvailabilityCheckboxesSection from './components/AvailabilityCheckboxesSection';
import ProductCodesSection from './components/ProductCodesSection';
import IngredientsSection from './components/IngredientsSection';
import FormActionsSection from './components/FormActionsSection';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [apiToken, setApiToken] = useState(null);

  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateModalMessage, setDuplicateModalMessage] = useState('Składnik już istnieje na liście. Nie można dodać duplikatów.');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setApiToken(token);
    }
  }, []);

  const [activeAddOptionModal, setActiveAddOptionModal] = useState({ type: null, isOpen: false });

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
      } else { 
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
      handleDropdownChange(entityType, newlyAddedOption);
      const dropdownRef = dropdownRefs[entityType];
      if (dropdownRef && dropdownRef.current && typeof dropdownRef.current.refreshAndSelect === 'function') {
        dropdownRef.current.refreshAndSelect(newlyAddedOption);
      } else {
        console.warn(`Dropdown ref or refreshAndSelect method not found for ${entityType}`);
      }
    }
    handleCloseAddOptionModal();
  };

  const handleItemDeletedFromDropdown = (deletedItemId, entityType) => {
    console.log(`Item ${deletedItemId} deleted from ${entityType}`);
    let fieldToClear = '';
    switch (entityType) {
      case 'rodzajProduktu': fieldToClear = 'rodzajProduktuId'; break;
      case 'jednostka': fieldToClear = 'jednostkaId'; break;
      case 'nadKategoria': fieldToClear = 'nadKategoriaId'; break;
      case 'opakowanie': fieldToClear = 'opakowanieId'; break;
      case 'stawkaVat': fieldToClear = 'stawkaVatId'; break;
      default: break;
    }

    if (fieldToClear && String(formData[fieldToClear]) === String(deletedItemId)) {
      handleDropdownChange(entityType, null);
    }
  };

  const handleSkladnikSelectedFromDropdown = (selectedSkladnik) => {
    if (selectedSkladnik && selectedSkladnik.nazwa) {
      const normalizedNewSkladnik = selectedSkladnik.nazwa.trim().toLowerCase();
      const isDuplicate = formData.skladniki.some(s => s.trim().toLowerCase() === normalizedNewSkladnik);
      if (isDuplicate) {
        setDuplicateModalMessage('Składnik już istnieje na liście. Nie można dodać duplikatów.');
        setIsDuplicateModalOpen(true);
      } else {
        setFormData(prev => ({
          ...prev,
          skladniki: [...prev.skladniki, selectedSkladnik.nazwa.trim()]
        }));
        setIsDuplicateModalOpen(false);
      }
    }
  };

  const handleAddNewSkladnikManual = (newSkladnikName) => {
    const trimmedSkladnikName = newSkladnikName.trim();
    if (trimmedSkladnikName !== '') {
      const normalizedNewSkladnik = trimmedSkladnikName.toLowerCase();
      const isDuplicate = formData.skladniki.some(s => s.trim().toLowerCase() === normalizedNewSkladnik);
      if (isDuplicate) {
        setDuplicateModalMessage('Wprowadzony składnik już istnieje na liście.');
        setIsDuplicateModalOpen(true);
      } else {
        setFormData(prev => ({
          ...prev,
          skladniki: [...prev.skladniki, trimmedSkladnikName]
        }));
        setIsDuplicateModalOpen(false);
      }
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
    if (!apiToken) {
      setSubmitError("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
      setIsSubmitting(false);
      return;
    }
    try {
      const encodedToken = encodeURIComponent(apiToken);
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
          <BasicProductInfoSection formData={formData} handleInputChange={handleInputChange} />

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
            enableDelete={true}
            deleteApiEndpoint="/api/app-data/rodzaj-produktu"
            apiToken={apiToken}
            onItemDeleted={(deletedId) => handleItemDeletedFromDropdown(deletedId, 'rodzajProduktu')}
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
            enableDelete={true}
            deleteApiEndpoint="/api/app-data/jednostka"
            apiToken={apiToken}
            onItemDeleted={(deletedId) => handleItemDeletedFromDropdown(deletedId, 'jednostka')}
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
            enableDelete={true}
            deleteApiEndpoint="/api/app-data/nad-kategoria"
            apiToken={apiToken}
            onItemDeleted={(deletedId) => handleItemDeletedFromDropdown(deletedId, 'nadKategoria')}
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
            enableDelete={true}
            deleteApiEndpoint="/api/app-data/opakowanie"
            apiToken={apiToken}
            onItemDeleted={(deletedId) => handleItemDeletedFromDropdown(deletedId, 'opakowanie')}
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
            enableDelete={true}
            deleteApiEndpoint="/api/app-data/stawka-vat"
            apiToken={apiToken}
            onItemDeleted={(deletedId) => handleItemDeletedFromDropdown(deletedId, 'stawkaVat')}
          />
          
          <ProductOptionsCheckboxesSection formData={formData} handleInputChange={handleInputChange} />
          <AvailabilityCheckboxesSection formData={formData} handleInputChange={handleInputChange} />
          <ProductCodesSection formData={formData} handleInputChange={handleInputChange} />

          <IngredientsSection 
            skladniki={formData.skladniki}
            apiToken={apiToken}
            handleSkladnikSelectedFromDropdown={handleSkladnikSelectedFromDropdown}
            handleAddNewSkladnikManual={handleAddNewSkladnikManual}
            handleRemoveSkladnik={handleRemoveSkladnik}
          />

          <div className={styles.formGroupFullWidth}>
            <ImageUploadManager images={formData.zdjecia} onImagesChange={handleImagesChange} />
          </div>

        </div>
        <FormActionsSection onClose={onClose} isSubmitting={isSubmitting} />
      </form>

      <InfoModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        title="Błąd Walidacji"
        message={duplicateModalMessage}
        buttonText="OK"
      />

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

