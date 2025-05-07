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
  onOptionAdded,
  // New props for delete functionality
  enableDelete = false,
  deleteApiEndpoint, // e.g., '/api/app-data/jednostka'
  apiToken, // For delete requests
  onItemDeleted // Callback after successful deletion: (itemId) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLabelState, setSelectedLabelState] = useState('');
  const dropdownRef = useRef(null);

  const loadOptions = useCallback(async (selectOptionAfterLoad = null) => {
    if (loading && !selectOptionAfterLoad) return; // Allow reload if selecting specific option
    setLoading(true);
    setError(null);
    try {
      const dataFromService = await fetchDataFunction();
      if (Array.isArray(dataFromService)) {
        setOptions(dataFromService);
        let optionToSelect = null;
        if (selectOptionAfterLoad) {
          optionToSelect = dataFromService.find(opt => String(opt[optionValueKey]) === String(selectOptionAfterLoad[optionValueKey]));
        }
        // If value is already set (e.g. from parent form data), find its label
        else if (value) {
          optionToSelect = dataFromService.find(opt => String(opt[optionValueKey]) === String(value));
        }

        if (optionToSelect) {
          setSelectedLabelState(String(optionToSelect[optionLabelKey]));
          // If we are selecting an option after load (e.g. after adding a new one), also call onChange
          if (selectOptionAfterLoad) {
            const syntheticEvent = { target: { name: name, value: optionToSelect[optionValueKey] } };
            onChange(syntheticEvent, optionToSelect);
          }
        } else if (!value) {
            setSelectedLabelState(''); // Clear label if no value and no option to select
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
    // Update selected label if value changes externally or options are loaded
    if (value && options.length > 0) {
      const currentOption = options.find(opt => String(opt[optionValueKey]) === String(value));
      if (currentOption) {
        setSelectedLabelState(String(currentOption[optionLabelKey]));
      } else {
        // If value exists but not in options (e.g. after delete), clear label
        setSelectedLabelState('');
      }
    } else if (!value) {
      setSelectedLabelState('');
    }
  }, [value, options, optionValueKey, optionLabelKey]);

  useEffect(() => {
    // Initial load when dropdown is opened for the first time
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
        loadOptions(); // Load options if opening and not already loaded
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

  const handleDeleteItem = async (itemId, e) => {
    e.stopPropagation(); // Prevent dropdown from closing or item selection
    if (!enableDelete || !deleteApiEndpoint || !apiToken) return;

    const confirmed = window.confirm("Czy na pewno chcesz usunąć ten element?");
    if (!confirmed) return;

    const encodedToken = encodeURIComponent(apiToken);
    const url = `http://localhost:8080${deleteApiEndpoint}/${itemId}?token=${encodedToken}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Błąd serwera bez szczegółów.' }));
        console.error(`Błąd API (${response.status}): ${errorData.message}`);
        alert(`Nie udało się usunąć elementu: ${errorData.message || response.statusText}`);
        return;
      }

      const result = await response.json();
      console.log('Element usunięty:', result);
      // alert(result.message || 'Element usunięty pomyślnie.');
      
      // Refresh options list
      await loadOptions(); 

      // If the deleted item was the currently selected one, clear the selection in parent form
      if (String(value) === String(itemId)) {
        const syntheticEvent = { target: { name: name, value: '' } }; // Simulate clearing
        onChange(syntheticEvent, null); // Notify parent to clear value
        setSelectedLabelState('');
      }

      if (onItemDeleted) {
        onItemDeleted(itemId);
      }

    } catch (error) {
      console.error('Błąd sieci lub wykonania fetch podczas usuwania:', error);
      alert('Wystąpił błąd sieciowy podczas próby usunięcia elementu.');
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
              <div className={styles.addButtonContainer}>
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
                      <span className={styles.optionLabel}>{String(option[optionLabelKey])}</span>
                      {enableDelete && deleteApiEndpoint && apiToken && (
                        <button 
                          type="button"
                          className={styles.deleteButton}
                          onClick={(e) => handleDeleteItem(option[optionValueKey], e)}
                          aria-label={`Usuń ${String(option[optionLabelKey])}`}
                        >
                          Usuń
                        </button>
                      )}
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

