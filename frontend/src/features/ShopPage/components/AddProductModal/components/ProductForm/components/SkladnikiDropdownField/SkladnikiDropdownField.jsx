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
      return null; // Return null on failure or if no token
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
        setAllSkladniki(data.data); // Set the master list
        return data.data; // Return the fetched ingredients
      } else {
        throw new Error(data.message || 'Nieprawidłowy format danych odpowiedzi API dla składników.');
      }
    } catch (err) {
      setError(err.message);
      setAllSkladniki([]); // Clear master list on error
      return null; // Return null on error
    } finally {
      setIsLoading(false);
    }
  }, [apiToken]);

  const filterSuggestions = useCallback((value) => {
    if (!value) {
      setSuggestions(allSkladniki); 
      return;
    }
    const filtered = allSkladniki.filter(s => 
      s.nazwa.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  }, [allSkladniki]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsDropdownVisible(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(async () => {
      if (value.trim() === '') {
        if (allSkladniki.length > 0) {
            setSuggestions(allSkladniki);
        } else if (!isLoading) {
            const fetchedIngredients = await fetchAllSkladniki();
            if (fetchedIngredients) {
                setSuggestions(fetchedIngredients);
            }
        }
      } else {
        filterSuggestions(value);
      }
    }, 300);
  };

  const handleInputFocus = async () => {
    setIsDropdownVisible(true);
    if (inputValue.trim() === '') {
      if (allSkladniki.length === 0 && !isLoading) {
        const fetchedIngredients = await fetchAllSkladniki();
        if (fetchedIngredients) {
          setSuggestions(fetchedIngredients);
        }
      } else {
        setSuggestions(allSkladniki);
      }
    } else {
      // If input is not empty on focus, filter based on current input value
      filterSuggestions(inputValue);
    }
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
    // After selection and clearing input, if user re-focuses, they should see all suggestions
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
      {/* This message should appear if user types and no matches are found */}
      {isDropdownVisible && !isLoading && suggestions.length === 0 && inputValue.trim() !== '' && (
         <div className={styles.noSuggestions}>Brak pasujących składników. Możesz dodać nowy.</div>
      )}
      {/* The message "Rozpocznij wpisywanie..." should no longer appear with the new logic,
          as suggestions will be populated if input is empty and data is available or fetched. 
          The condition for it was: 
          isDropdownVisible && !isLoading && suggestions.length === 0 && inputValue.trim() === '' && allSkladniki.length > 0 
          This should now be false if logic is correct. */}
    </div>
  );
};

export default SkladnikiDropdownField;

