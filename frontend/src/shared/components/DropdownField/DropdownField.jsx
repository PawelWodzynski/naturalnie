import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './DropdownField.module.css';

const DropdownField = ({
  label,
  name, 
  value, 
  onChange, 
  fetchDataFunction, 
  optionValueKey, 
  optionLabelKey, 
  required,
  placeholder = 'Wybierz...',
  entityType, // New prop: e.g., "rodzajProduktu", "jednostka"
  onOpenAddModal, // New prop: callback to open the add modal for this entity type
  onOptionAdded // New prop: callback to inform DropdownField that a new option was added externally
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLabelState, setSelectedLabelState] = useState('');
  const dropdownRef = useRef(null);

  const loadOptions = useCallback(async (selectOptionAfterLoad = null) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const dataFromService = await fetchDataFunction();
      if (Array.isArray(dataFromService)) {
        setOptions(dataFromService);
        let optionToSelect = null;
        if (selectOptionAfterLoad) {
          optionToSelect = dataFromService.find(opt => String(opt[optionValueKey]) === String(selectOptionAfterLoad[optionValueKey]));
        } else if (value) {
          optionToSelect = dataFromService.find(opt => String(opt[optionValueKey]) === String(value));
        }

        if (optionToSelect) {
          setSelectedLabelState(String(optionToSelect[optionLabelKey]));
          // Ensure ProductForm is also updated if a new option was auto-selected after add
          if (selectOptionAfterLoad) {
            const syntheticEvent = { target: { name: name, value: optionToSelect[optionValueKey] } };
            onChange(syntheticEvent, optionToSelect);
          }
        } else if (!value) {
            setSelectedLabelState('');
        }

      } else {
        setOptions([]);
        setError(`Nieprawidłowy format danych dla ${label}.`);
      }
    } catch (err) {
      setError(err.message || `Nie udało się załadować danych dla pola ${label}.`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchDataFunction, label, loading, value, optionValueKey, optionLabelKey, name, onChange]);

  // Effect to update selectedLabelState when the initial value changes or options are loaded
  useEffect(() => {
    if (value && options.length > 0) {
      const currentOption = options.find(opt => String(opt[optionValueKey]) === String(value));
      if (currentOption) {
        setSelectedLabelState(String(currentOption[optionLabelKey]));
      } else {
        setSelectedLabelState('');
      }
    } else if (!value) {
      setSelectedLabelState('');
    }
  }, [value, options, optionValueKey, optionLabelKey]);

  // Handle externally added option
  useEffect(() => {
    if (onOptionAdded) { // This prop would be a signal, perhaps with the new option data
        // The actual logic to use onOptionAdded will be more complex.
        // For now, let's assume ProductForm will manage re-selecting or re-loading.
        // A better approach: ProductForm calls a method on DropdownField ref, or DropdownField re-fetches.
        // Simplest for now: if onOptionAdded is a new option object, try to select it.
        // This is a placeholder for a more robust mechanism.
    }
  }, [onOptionAdded, loadOptions]); 


  useEffect(() => {
    if (isOpen && options.length === 0 && !loading && !error) {
      loadOptions();
    }
  }, [isOpen, options.length, loadOptions, loading, error]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    if (!isOpen && options.length === 0 && !loading) {
        loadOptions();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionClick = (option) => {
    const syntheticEvent = {
      target: {
        name: name, 
        value: option[optionValueKey]
      }
    };
    onChange(syntheticEvent, option); 
    setSelectedLabelState(String(option[optionLabelKey]));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddNewClick = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing if button is inside header
    if (onOpenAddModal && entityType) {
      onOpenAddModal(entityType);
      setIsOpen(false); // Close dropdown when opening modal
    }
  };

  // Public method to refresh options and select a new one (called via ref from ProductForm)
  // This is a more robust way to handle option added from modal
  const refreshAndSelectOption = useCallback((newOption) => {
    loadOptions(newOption); // Reload all options and try to select the new one
  }, [loadOptions]);

  // Expose the refresh method via onOptionAdded prop (which ProductForm will use to pass the ref's method)
  useEffect(() => {
    if (typeof onOptionAdded === 'function') {
        onOptionAdded({
            refreshAndSelect: refreshAndSelectOption
        });
    }
  }, [onOptionAdded, refreshAndSelectOption]);


  const filteredOptions = options.filter(option => {
    if (option && option[optionLabelKey] != null) {
        return String(option[optionLabelKey]).toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <div className={styles.formGroup} ref={dropdownRef}>
      <label htmlFor={`${name}-search-input`}>{label}:</label>
      <div className={styles.dropdownContainer}>
        <div className={styles.dropdownHeader} onClick={toggleDropdown} role="button" tabIndex={0} aria-haspopup="listbox" aria-expanded={isOpen}>
          {selectedLabelState || <span className={styles.placeholder}>{placeholder}</span>}
          <span className={`${styles.dropdownArrow} ${isOpen ? styles.open : ''}`}>&#9660;</span>
        </div>
        {isOpen && (
          <div className={styles.dropdownListContainer}>
            <div className={styles.searchAndAddContainer}>
              <input
                type="text"
                id={`${name}-search-input`}
                className={styles.searchInput}
                placeholder="Szukaj..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()} 
                autoFocus
              />
              {onOpenAddModal && entityType && (
                <button 
                  type="button" 
                  className={styles.addButton}
                  onClick={handleAddNewClick}
                >
                  Dodaj
                </button>
              )}
            </div>
            {loading && <div className={styles.dropdownMessage}>Ładowanie...</div>}
            {error && <div className={`${styles.dropdownMessage} ${styles.errorMessage}`}>{error}</div>}
            {!loading && !error && (
              <ul className={styles.dropdownList} role="listbox">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option[optionValueKey]}
                      onClick={() => handleOptionClick(option)}
                      className={styles.dropdownItem}
                      role="option"
                      aria-selected={String(option[optionValueKey]) === String(value)}
                    >
                      {String(option[optionLabelKey])}
                    </li>
                  ))
                ) : (
                  <li className={styles.dropdownMessage}>
                    {options.length > 0 && searchTerm ? 'Brak pasujących opcji.' : (options.length === 0 && !loading ? 'Brak dostępnych opcji.' : '')}
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownField;

