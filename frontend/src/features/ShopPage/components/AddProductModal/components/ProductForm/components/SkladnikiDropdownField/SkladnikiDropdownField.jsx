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
      return null;
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
        return data.data;
      } else {
        throw new Error(data.message || 'Nieprawidłowy format danych odpowiedzi API dla składników.');
      }
    } catch (err) {
      setError(err.message);
      setAllSkladniki([]);
      return null;
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
    setInputValue('');
    setIsDropdownVisible(false);
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

  const handleDeleteSkladnik = async (skladnikId, e) => {
    e.stopPropagation(); // Prevent item selection or dropdown closing
    if (!apiToken) {
      alert('Brak tokenu API do wykonania operacji.');
      return;
    }

    const confirmed = window.confirm("Czy na pewno chcesz usunąć ten składnik?");
    if (!confirmed) return;

    const encodedToken = encodeURIComponent(apiToken);
    const url = `http://localhost:8080/api/app-data/skladnik/${skladnikId}?token=${encodedToken}`;

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
        alert(`Nie udało się usunąć składnika: ${errorData.message || response.statusText}`);
        return;
      }

      const result = await response.json();
      console.log('Składnik usunięty:', result);
      // alert(result.message || 'Składnik usunięty pomyślnie.');
      
      // Refresh the list of all ingredients and suggestions
      const updatedSkladniki = await fetchAllSkladniki();
      if (updatedSkladniki) {
        // If input is empty, show all new suggestions, otherwise filter by current input
        if (inputValue.trim() === '') {
            setSuggestions(updatedSkladniki);
        } else {
            const filtered = updatedSkladniki.filter(s => 
                s.nazwa.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
        }
      }
      // Note: This does not automatically remove the Skladnik from the ProductForm's formData.skladniki list.
      // That would require a callback to the parent, which is not specified in the current design for Skladniki.

    } catch (error) {
      console.error('Błąd sieci lub wykonania fetch podczas usuwania składnika:', error);
      alert('Wystąpił błąd sieciowy podczas próby usunięcia składnika.');
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
              <span className={styles.suggestionLabel}>{suggestion.nazwa}</span>
              <button
                type="button"
                className={styles.deleteButtonSkladnik} // Use specific class if needed, or generic
                onClick={(e) => handleDeleteSkladnik(suggestion.id, e)}
                aria-label={`Usuń ${suggestion.nazwa}`}
              >
                Usuń
              </button>
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

