import React, { useRef } from 'react'; // Removed useState, useCallback, useEffect as they are in hooks
import styles from './ProductForm.module.css';
import ImageUploadManager from './components/ImageUploadManager';
import DropdownField from '../../../../../../shared/components/DropdownField/DropdownField';
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

// Import Custom Hooks
import { useProductForm, useProductModals, useProductSubmit } from './hooks';

const ProductForm = ({ onClose }) => {
  const {
    formData,
    setFormData, // Keep for handleItemDeletedFromDropdown
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
  } = useProductForm();

  // Dropdown refs remain in the main component as they are tied to UI elements here
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

  const {
    activeAddOptionModal,
    handleOpenAddOptionModal,
    handleCloseAddOptionModal,
    handleOptionSuccessfullyAdded,
  } = useProductModals(handleDropdownChange, dropdownRefs);

  const {
    isSubmitting,
    submitError,
    handleSubmit,
  } = useProductSubmit(formData, apiToken, onClose);

  // This handler interacts with formData directly, so it's kept here
  // or could be moved to useProductForm if setFormData is passed to it.
  // For now, useProductForm exposes setFormData, so this can stay or be moved.
  // Let's keep it here for clarity as it uses handleDropdownChange from useProductForm.
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
      handleDropdownChange(entityType, null); // Uses handleDropdownChange from useProductForm
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
            onOpenAddModal={() => handleOpenAddOptionModal('rodzajProduktu')}
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
            onOpenAddModal={() => handleOpenAddOptionModal('jednostka')}
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
            onOpenAddModal={() => handleOpenAddOptionModal('nadKategoria')}
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
            onOpenAddModal={() => handleOpenAddOptionModal('opakowanie')}
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
            onOpenAddModal={() => handleOpenAddOptionModal('stawkaVat')}
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
            apiToken={apiToken} // Pass apiToken if IngredientsSection needs it for SkladnikiDropdownField
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
        onClose={() => setIsDuplicateModalOpen(false)} // This setter comes from useProductForm
        title="Błąd Walidacji"
        message={duplicateModalMessage} // This state comes from useProductForm
        buttonText="OK"
      />

      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'rodzajProduktu' && (
        <AddRodzajProduktuModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={(newOpt) => handleOptionSuccessfullyAdded(newOpt, 'rodzajProduktu')}
          apiAddFunction={addRodzajProduktu}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'jednostka' && (
        <AddJednostkaModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={(newOpt) => handleOptionSuccessfullyAdded(newOpt, 'jednostka')}
          apiAddFunction={addJednostka}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'nadKategoria' && (
        <AddNadKategoriaModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={(newOpt) => handleOptionSuccessfullyAdded(newOpt, 'nadKategoria')}
          apiAddFunction={addNadKategoria}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'opakowanie' && (
        <AddOpakowanieModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={(newOpt) => handleOptionSuccessfullyAdded(newOpt, 'opakowanie')}
          apiAddFunction={addOpakowanie}
        />
      )}
      {activeAddOptionModal.isOpen && activeAddOptionModal.type === 'stawkaVat' && (
        <AddStawkaVatModal 
          isOpen={true} 
          onClose={handleCloseAddOptionModal} 
          onOptionSuccessfullyAdded={(newOpt) => handleOptionSuccessfullyAdded(newOpt, 'stawkaVat')}
          apiAddFunction={addStawkaVat}
        />
      )}
    </>
  );
};

export default ProductForm;

