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
  entityType, 
  onOpenAddModal, 
  onOptionAdded 
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

  useEffect(() => {
    if (onOptionAdded) { 
        // Placeholder for a more robust mechanism handled by ProductForm and refs
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
    e.stopPropagation(); 
    if (onOpenAddModal && entityType) {
      onOpenAddModal(entityType);
      setIsOpen(false); 
    }
  };

  const refreshAndSelectOption = useCallback((newOption) => {
    loadOptions(newOption); 
  }, [loadOptions]);

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
              <div className={styles.addButtonContainer}> {/* New container for centering */}
                <button 
                  type="button" 
                  className={`${styles.button} ${styles.addButtonGreen}`}
                  onClick={handleAddNewClick}
                >
                  Dodaj
                </button>
              </div>
            )}
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

