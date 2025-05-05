# Zasady Tworzenia Requestów API (Frontend React)

Ten dokument opisuje zasady tworzenia żądań HTTP z aplikacji frontendowej React do backendu.

## 1. Metoda Wysyłania Żądań: `fetch`

**Wszystkie żądania do API backendu muszą być realizowane przy użyciu natywnego API `fetch`.**

- **Axios**: Biblioteka `axios` **nie jest już używana** w projekcie do wysyłania żądań API. Należy unikać jej stosowania w nowym kodzie i refaktoryzować istniejący kod, jeśli to możliwe.
- **Proxy**: Konfiguracja `proxy` w pliku `package.json` **nie jest już używana**. Została usunięta lub powinna być ignorowana.

## 2. Adres URL Backendu

Żądania muszą być kierowane **bezpośrednio** na adres backendu działającego lokalnie:

`http://localhost:8080/nazwa-endpointu`

**Przykład:**
```javascript
const response = await fetch("http://localhost:8080/validate-token?token=...", {
  method: "GET",
  headers: {
    "Accept": "application/json" // Ważne, aby oczekiwać JSON
  }
});
```

## 3. Autoryzacja (Token JWT)

Dla endpointów wymagających uwierzytelnienia, **token JWT musi być dołączony do żądania wyłącznie jako parametr zapytania (query parameter) w adresie URL.**

- **Nagłówek `Authorization`**: **Nie używamy** nagłówka `Authorization` ani formatu `Bearer` do przesyłania tokenu.
- Token jest przechowywany w `localStorage` po pomyślnym zalogowaniu lub rejestracji.
- Należy pobrać token z `localStorage`, zakodować go za pomocą `encodeURIComponent`, a następnie dodać do adresu URL jako parametr `token`, np. `?token=<zakodowany_token>`.

**Przykład (wewnątrz funkcji `async`):**
```javascript
const token = localStorage.getItem("token");

if (token) {
  try {
    // Zakoduj token przed dodaniem go do URL
    const encodedToken = encodeURIComponent(token);
    
    // Dodaj zakodowany token jako parametr zapytania 'token' do URL
    const url = `http://localhost:8080/some-protected-endpoint?token=${encodedToken}`;

    const response = await fetch(url, {
      method: "GET", // lub POST, PUT, DELETE
      headers: {
        // Nie dodajemy nagłówka Authorization
        "Content-Type": "application/json", // Jeśli wysyłasz JSON w ciele żądania (np. POST/PUT)
        "Accept": "application/json" // Dobra praktyka, aby oczekiwać JSON
      },
      // body: JSON.stringify(data) // Dla metod POST/PUT
    });

    if (!response.ok) {
      // Obsługa błędów HTTP (np. 401, 403, 404, 500)
      console.error("API request failed with status:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); // Przetwarzanie odpowiedzi JSON
    // ... obsługa sukcesu

  } catch (error) {
    console.error("Error during API request:", error);
    // ... obsługa błędów sieciowych lub innych
  }
} else {
  console.log("No token found, user is not authenticated.");
  // ... obsługa braku tokenu (np. przekierowanie do logowania)
}
```

## 4. Obsługa Odpowiedzi i Błędów

- Zawsze sprawdzaj status odpowiedzi (`response.ok` lub `response.status`).
- Używaj bloków `try...catch` do obsługi błędów sieciowych lub błędów podczas przetwarzania odpowiedzi.
- Przetwarzaj odpowiedź JSON za pomocą `response.json()`.

## 5. Szczegółowy Przykład Implementacji (`ProtectedRoute.js`)

Poniższy fragment kodu z `ProtectedRoute.js` pokazuje, jak używać `fetch` do walidacji tokenu JWT pobranego z `localStorage` poprzez wysłanie żądania GET do endpointu `/validate-token` na `localhost:8080`, **przesyłając token jako parametr zapytania**:

```javascript
// ... wewnątrz komponentu React lub funkcji async

const validateToken = async () => {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute - Token from localStorage:", token);

  if (!token) {
    console.log("ProtectedRoute - No token found, setting unauthenticated.");
    // ... obsługa braku tokenu
    return;
  }

  try {
    console.log(`ProtectedRoute - Validating token: ${token}`);
    
    // Zakoduj token przed dodaniem go do URL
    const encodedToken = encodeURIComponent(token);
    
    // Wyślij żądanie GET do backendu z tokenem jako parametr query
    const response = await fetch(`http://localhost:8080/validate-token?token=${encodedToken}`, {
      method: 'GET',
      headers: {
        // Ważne: Określ, że oczekujesz odpowiedzi w formacie JSON
        'Accept': 'application/json'
        // Nie dodajemy nagłówka Authorization
      }
    });
    
    // Sprawdź, czy odpowiedź serwera jest poprawna (status 2xx)
    if (!response.ok) {
      // Rzuć błąd, jeśli status odpowiedzi wskazuje na problem (np. 401, 404, 500)
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    // Przekształć ciało odpowiedzi na obiekt JSON
    const data = await response.json();
    console.log("ProtectedRoute - Validation response:", data);

    // Sprawdź, czy token jest ważny na podstawie odpowiedzi z backendu
    if (data && data.tokenValidity === true) {
      console.log("ProtectedRoute - Token is valid, setting authenticated. Roles:", data.roles);
      // ... ustaw stan uwierzytelnienia na true, zapisz role
    } else {
      console.log("ProtectedRoute - Token is invalid, setting unauthenticated.");
      // ... ustaw stan uwierzytelnienia na false, usuń token/role
    }
  } catch (error) {
    // Obsłuż błędy sieciowe lub błędy podczas przetwarzania odpowiedzi
    console.error("ProtectedRoute - Error validating token:", error);
    // ... ustaw stan uwierzytelnienia na false, usuń token/role
  }
  
  // ... zakończ stan ładowania
};

// Wywołaj funkcję walidacji (np. w useEffect)
validateToken();

```

**Kluczowe punkty w przykładzie:**
- Pobranie tokenu z `localStorage`.
- Użycie `encodeURIComponent` dla tokenu w URL.
- Wywołanie `fetch` z metodą `GET` i pełnym adresem `http://localhost:8080/validate-token`, **z tokenem w parametrze zapytania `?token=`**.
- **Brak nagłówka `Authorization`**.
- Ustawienie nagłówka `Accept: 'application/json'`.
- Sprawdzenie `response.ok` do obsługi błędów HTTP.
- Przetworzenie odpowiedzi za pomocą `response.json()`.
- Obsługa błędów za pomocą `try...catch`.
- Logika warunkowa oparta na polu `tokenValidity` z odpowiedzi.

## 6. Tworzenie Nowych Endpointów Backendowych

Jeśli zachodzi potrzeba stworzenia nowego endpointu po stronie backendu, zapoznaj się z zasadami opisanymi w pliku `/java-architecture-rules/endpoint_rules.md` (jeśli istnieje).

