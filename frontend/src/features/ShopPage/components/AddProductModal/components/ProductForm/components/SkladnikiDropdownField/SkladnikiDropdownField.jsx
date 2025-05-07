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
        setSuggestions(data.data); // Initially show all when focused and empty
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
    // Fetch all ingredients once on mount if token is available
    // Or, fetch on first focus if preferred (current design: on focus)
  }, [fetchAllSkladniki]);

  const filterSuggestions = (value) => {
    if (!value) {
      setSuggestions(allSkladniki); // Show all if input is cleared
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
        setSuggestions(allSkladniki); // Show all if input is empty after debounce
      } else {
        filterSuggestions(value);
      }
    }, 300); // 300ms debounce
  };

  const handleInputFocus = () => {
    if (allSkladniki.length === 0 && !isLoading) {
        fetchAllSkladniki(); // Fetch if not already fetched
    } else {
        // If already fetched, filter based on current input or show all
        if (inputValue.trim() === '') {
            setSuggestions(allSkladniki);
        } else {
            filterSuggestions(inputValue);
        }
    }
    setIsDropdownVisible(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.nazwa); // Uzupełnij pole formularza
    onSkladnikSelected(suggestion); // Przekaż wybrany obiekt składnika
    setIsDropdownVisible(false);
    // Optionally clear suggestions or keep them filtered based on the new input value
    // For now, we hide the dropdown, input is filled.
  };

  const handleAddButtonClick = () => {
    if (inputValue.trim() !== '') {
      onNewSkladnikAdd(inputValue.trim());
      setInputValue(''); // Clear input after adding
      setSuggestions(allSkladniki); // Reset suggestions to all or empty based on desired behavior
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
    </div>
  );
};

export default SkladnikiDropdownField;

