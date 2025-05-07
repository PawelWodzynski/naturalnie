import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './SkladnikiDropdownField.module.css';

const SkladnikiDropdownField = ({ apiToken, onSkladnikSelected, onNewSkladnikAdd }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allSkladniki, setAllSkladniki] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeoutRef = useRef(null);
  const componentRef = useRef(null);

  const fetchAllSkladniki = useCallback(async () => {
    if (!apiToken) {
      setError('Brak tokenu API do pobrania składników.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/app-data/skladnik?token=${encodeURIComponent(apiToken)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Nie udało się przetworzyć odpowiedzi błędu serwera.' }));
        throw new Error(`Błąd serwera: ${response.status} - ${errorData.message || 'Nieznany błąd podczas pobierania składników'}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setAllSkladniki(data.data);
        // Set suggestions to allSkladniki only if input is empty and dropdown is visible, handled in onFocus
      } else {
        throw new Error(data.message || 'Nieprawidłowy format danych odpowiedzi API dla składników.');
      }
    } catch (err) {
      setError(err.message);
      setAllSkladniki([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiToken]);

  useEffect(() => {
    // Initial fetch on component mount if token is present and allSkladniki is empty
    if (apiToken && allSkladniki.length === 0) {
        // fetchAllSkladniki(); // Or fetch on first focus as per current design
    }
  }, [apiToken, allSkladniki.length, fetchAllSkladniki]);

  const filterSuggestions = (value) => {
    if (!value) {
      setSuggestions(allSkladniki); 
      return;
    }
    const filtered = allSkladniki.filter(s => 
      s.nazwa.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsDropdownVisible(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (value.trim() === '') {
        if (allSkladniki.length > 0) {
            setSuggestions(allSkladniki);
        } else if (!isLoading) {
            fetchAllSkladniki(); // Fetch if allSkladniki is empty and not already loading
        }
      } else {
        filterSuggestions(value);
      }
    }, 300); 
  };

  const handleInputFocus = () => {
    if (allSkladniki.length === 0 && !isLoading) {
        fetchAllSkladniki().then(() => {
            // After fetching, if input is still empty, show all suggestions
            if (inputValue.trim() === '') {
                // Need to access the updated allSkladniki, so might need a slight refactor or rely on useEffect
                // For now, let's assume fetchAllSkladniki sets suggestions if it's the initial load
            }
        });
    } else {
        if (inputValue.trim() === '') {
            setSuggestions(allSkladniki);
        } else {
            filterSuggestions(inputValue);
        }
    }
    setIsDropdownVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSuggestionClick = (suggestion) => {
    onSkladnikSelected(suggestion); 
    setInputValue(''); // Clear input field after selection
    setIsDropdownVisible(false);
    // Optionally, reset suggestions to the full list if the user re-focuses the empty input
    setSuggestions(allSkladniki); 
  };

  const handleAddButtonClick = () => {
    if (inputValue.trim() !== '') {
      onNewSkladnikAdd(inputValue.trim());
      setInputValue(''); 
      setSuggestions(allSkladniki); 
      setIsDropdownVisible(false);
    }
  };

  return (
    <div className={styles.skladnikiDropdownContainer} ref={componentRef}>
      <div className={styles.inputWithButton}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Wpisz lub wybierz składnik"
          className={styles.inputField}
        />
        <button type="button" onClick={handleAddButtonClick} className={styles.addButton}>
          Dodaj
        </button>
      </div>
      {isLoading && <div className={styles.loadingMessage}>Ładowanie składników...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {isDropdownVisible && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion.id} 
              onClick={() => handleSuggestionClick(suggestion)} 
              className={styles.suggestionItem}
            >
              {suggestion.nazwa}
            </li>
          ))}
        </ul>
      )}
      {isDropdownVisible && !isLoading && suggestions.length === 0 && inputValue.trim() !== '' && (
         <div className={styles.noSuggestions}>Brak pasujących składników. Możesz dodać nowy.</div>
      )}
       {isDropdownVisible && !isLoading && suggestions.length === 0 && inputValue.trim() === '' && allSkladniki.length > 0 && (
         <div className={styles.noSuggestions}>Rozpocznij wpisywanie, aby wyszukać lub wybrać z listy.</div>
      )}
    </div>
  );
};

export default SkladnikiDropdownField;

