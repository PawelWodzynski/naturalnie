import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './DropdownField.module.css';

const DropdownField = ({
  label,
  name, // Name of the form field this dropdown controls
  value, // The current value of the form field (e.g., an ID)
  onChange, // Function to call when an option is selected: onChange(syntheticEvent, selectedOptionObject)
  fetchDataFunction, // Async function to fetch options
  optionValueKey, // Key in option objects for the value (e.g., 'id')
  optionLabelKey, // Key in option objects for the display label (e.g., 'nazwa', 'wartosc')
  required,
  placeholder = 'Wybierz...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLabelState, setSelectedLabelState] = useState(''); // Renamed to avoid conflict with label prop
  const dropdownRef = useRef(null);

  // Effect to update selectedLabelState when the initial value changes or options are loaded
  useEffect(() => {
    if (value && options.length > 0) {
      const currentOption = options.find(opt => String(opt[optionValueKey]) === String(value));
      if (currentOption) {
        setSelectedLabelState(String(currentOption[optionLabelKey]));
      } else {
        // If value exists but not in options, it might be an initial load before options are fetched
        // or an invalid value. We can clear or show the value itself if no label found.
        setSelectedLabelState(''); // Or String(value) if you want to show the ID
      }
    } else if (!value) {
      setSelectedLabelState(''); // Clear label if value is cleared externally
    }
  }, [value, options, optionValueKey, optionLabelKey]);

  const loadOptions = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const dataFromService = await fetchDataFunction();
      if (Array.isArray(dataFromService)) {
        setOptions(dataFromService);
        // If there's an initial value, find its label after loading
        if (value) {
          const currentOption = dataFromService.find(opt => String(opt[optionValueKey]) === String(value));
          if (currentOption) {
            setSelectedLabelState(String(currentOption[optionLabelKey]));
          }
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
  }, [fetchDataFunction, label, loading, value, optionValueKey, optionLabelKey]);

  // Load options when dropdown opens for the first time or if options are empty and not loading/error
  useEffect(() => {
    if (isOpen && options.length === 0 && !loading && !error) {
      loadOptions();
    }
  }, [isOpen, options.length, loadOptions, loading, error]);

  // Handle clicks outside the dropdown to close it
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
    // If opening and options are not loaded yet, trigger load
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

  const filteredOptions = options.filter(option => {
    // Ensure option and option[optionLabelKey] are valid before calling toLowerCase()
    if (option && option[optionLabelKey] != null) { // != null checks for both null and undefined
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
              onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking input
              autoFocus
            />
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

