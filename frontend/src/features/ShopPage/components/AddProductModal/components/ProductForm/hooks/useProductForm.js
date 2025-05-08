import { useState, useEffect, useCallback } from 'react';

export const initialFormData = {
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

const useProductForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [apiToken, setApiToken] = useState(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateModalMessage, setDuplicateModalMessage] = useState('Składnik już istnieje na liście. Nie można dodać duplikatów.');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setApiToken(token);
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' && name !== 'stawkaVatWartosc') ? parseFloat(value) : value
    }));
  }, []);

  const handleDropdownChange = useCallback((dropdownName, selectedOption) => {
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
  }, []);

  const handleImagesChange = useCallback((newImages) => {
    setFormData(prev => ({ ...prev, zdjecia: newImages }));
  }, []);

  const handleSkladnikSelectedFromDropdown = useCallback((selectedSkladnik) => {
    setFormData(prev => {
      if (selectedSkladnik && selectedSkladnik.nazwa) {
        const normalizedNewSkladnik = selectedSkladnik.nazwa.trim().toLowerCase();
        const isDuplicate = prev.skladniki.some(s => s.trim().toLowerCase() === normalizedNewSkladnik);
        if (isDuplicate) {
          setDuplicateModalMessage('Składnik już istnieje na liście. Nie można dodać duplikatów.');
          setIsDuplicateModalOpen(true);
          return prev;
        } else {
          setIsDuplicateModalOpen(false);
          return {
            ...prev,
            skladniki: [...prev.skladniki, selectedSkladnik.nazwa.trim()]
          };
        }
      }
      return prev;
    });
  }, []);

  const handleAddNewSkladnikManual = useCallback((newSkladnikName) => {
    setFormData(prev => {
      const trimmedSkladnikName = newSkladnikName.trim();
      if (trimmedSkladnikName !== '') {
        const normalizedNewSkladnik = trimmedSkladnikName.toLowerCase();
        const isDuplicate = prev.skladniki.some(s => s.trim().toLowerCase() === normalizedNewSkladnik);
        if (isDuplicate) {
          setDuplicateModalMessage('Wprowadzony składnik już istnieje na liście.');
          setIsDuplicateModalOpen(true);
          return prev;
        } else {
          setIsDuplicateModalOpen(false);
          return {
            ...prev,
            skladniki: [...prev.skladniki, trimmedSkladnikName]
          };
        }
      }
      return prev;
    });
  }, []);

  const handleRemoveSkladnik = useCallback((indexToRemove) => {
    setFormData(prev => ({ ...prev, skladniki: prev.skladniki.filter((_, index) => index !== indexToRemove) }));
  }, []);

  return {
    formData,
    setFormData, // Exposing setFormData directly for flexibility if needed, e.g., for handleItemDeletedFromDropdown
    apiToken,
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    duplicateModalMessage,
    handleInputChange,
    handleDropdownChange,
    handleImagesChange,
    handleSkladnikSelectedFromDropdown,
    handleAddNewSkladnikManual,
    handleRemoveSkladnik
  };
};

export default useProductForm;

