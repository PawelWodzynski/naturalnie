# Zasady Tworzenia API Backendowego (Java/Spring)

Ten dokument opisuje zasady i najlepsze praktyki dotyczące tworzenia nowych endpointów API w backendzie projektu.

## 1. Kolejność Tworzenia Komponentów

Rozwój nowego endpointu API powinien przebiegać w następującej kolejności:

1.  **Struktura Bazy Danych**: Zaprojektuj lub zaktualizuj strukturę tabel i kolumn potrzebnych dla nowej funkcjonalności w odpowiednim skrypcie SQL.
2.  **Encje (Entities)**: Stwórz lub zaktualizuj klasy encji JPA (@Entity), które mapują się na tabele bazy danych.
3.  **Repozytoria (Repositories)**: Stwórz interfejsy repozytoriów (rozszerzające JpaRepository lub inne), aby zapewnić dostęp do danych dla nowo utworzonych encji.
4.  **Serwisy (Services)**: Zaimplementuj logikę biznesową w klasach serwisowych (@Service). Serwisy orkiestrują operacje, wykorzystując repozytoria do interakcji z bazą danych.
5.  **Klasy Pomocnicze (Utilities)**: Jeśli logika w serwisie staje się złożona lub wymaga reużywalnych funkcji (np. walidacja, transformacja danych, skomplikowane obliczenia), **zdecydowanie preferuj wydzielanie jej do osobnych klas pomocniczych** (np. w pakiecie `util` lub dedykowanym podpakiecie serwisu) zamiast tworzenia wielu metod prywatnych w klasie serwisowej. Wstrzykuj te klasy pomocnicze do serwisu.
6.  **Kontroler (Controller)**: Na końcu stwórz metodę w odpowiednim kontrolerze (@RestController), która będzie obsługiwać żądanie HTTP. Metoda ta powinna być jak najprostsza, delegując całą logikę do serwisu i używając standardowego szablonu obsługi odpowiedzi.

## 2. Projektowanie Bazy Danych

- **Skrypty SQL**: Projektowanie struktury bazy danych odbywa się poprzez edycję plików SQL w katalogu `sql-scripts/`:
    - `01-auth-db.sql`: Zawiera strukturę tabel związanych wyłącznie z uwierzytelnianiem i autoryzacją użytkowników (np. `employee`, `role`).
    - `02-app-data-db.sql`: Zawiera strukturę tabel dla wszystkich pozostałych danych aplikacji.
- **Charakter Skryptów**: Pamiętaj, że te skrypty służą do inicjalizacji bazy danych od zera. Nie są one odzwierciedleniem "żywej" bazy danych, lecz definicją jej struktury.
- **Relacje między Schematami**: **Nie twórz bezpośrednich relacji (kluczy obcych)** między tabelami ze schematu `auth` (`01-auth-db.sql`) a tabelami ze schematu `app-data` (`02-app-data-db.sql`). Jeśli w danych aplikacji potrzebujesz odniesienia do użytkownika (np. `Employee`), przechowuj jedynie jego identyfikator (`employee_id`) jako zwykłe pole, bez formalnego klucza obcego do tabeli `employee`.

## 3. Szablon Metody Kontrolera

Wszystkie metody w kontrolerach API powinny przestrzegać poniższego szablonu, wykorzystując istniejące klasy pomocnicze (`AuthUtil`, `ResponseUtil`) i obsługę wyjątków:

```java
@GetMapping("/przykladowy-endpoint") // lub @PostMapping, @PutMapping, @DeleteMapping
public ResponseEntity<?> nazwaMetodyApi(
        @RequestParam(required = true) String token, // Przyjmowanie tokenu jako query param
        /* inne parametry @RequestParam, @PathVariable lub @RequestBody */
) {
    try {
        // 1. Uwierzytelnienie (Standardowo wymagane - pomijane tylko w wyjątkowych przypadkach)
        // Pobierz uwierzytelnionego użytkownika lub rzuć wyjątek, jeśli nie jest zalogowany.
        // W 99% przypadków ten krok jest obowiązkowy.
        Employee employee = authUtil.getAuthenticatedUserOrThrow(); 
        // Pominięcie tego kroku jest wyjątkiem od reguły i wymaga uzasadnienia.

        // 2. Wywołanie logiki biznesowej w serwisie
        // Przekaż potrzebne parametry do metody serwisowej.
        // Odbierz wynik operacji.
        Object result = nazwaSerwisu.metodaLogikiBiznesowej(/* parametry */);

        // 3. Zwrócenie odpowiedzi sukcesu
        // Użyj ResponseUtil do stworzenia standardowej odpowiedzi sukcesu.
        return ResponseEntity.ok(responseUtil.createSuccessResponse("Operacja zakończona sukcesem", result));

    } catch (UserNotAuthenticatedException e) {
        // 4. Obsługa błędu braku uwierzytelnienia
        // Zwróć status 401 Unauthorized z wiadomością z wyjątku.
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(responseUtil.createErrorResponse(e.getMessage()));
                
    } catch (SpecificBusinessException e) { // Np. ResourceNotFoundException, ValidationException
        // 5. Obsługa specyficznych wyjątków biznesowych rzucanych przez serwis
        // Zwróć odpowiedni status HTTP (np. 404, 400) z wiadomością z wyjątku.
        return ResponseEntity.status(HttpStatus.BAD_REQUEST) // lub NOT_FOUND, etc.
                .body(responseUtil.createErrorResponse(e.getMessage()));
                
    } catch (Exception e) {
        // 6. Obsługa ogólnych, nieoczekiwanych błędów
        // Zaloguj błąd i zwróć status 500 Internal Server Error.
        System.err.println("Błąd w endpointcie /przykladowy-endpoint: " + e.getMessage()); // TODO: Zastąpić logowaniem przez logger
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(responseUtil.createErrorResponse("Wystąpił wewnętrzny błąd serwera."));
    }
}
```

**Kluczowe elementy szablonu:**
- Użycie bloku `try-catch` do obsługi wyjątków.
- **Standardowe wywołanie `authUtil.getAuthenticatedUserOrThrow()`** na początku bloku `try` dla zabezpieczonych endpointów (pomijane tylko w wyjątkowych, uzasadnionych przypadkach).
- Delegowanie logiki biznesowej do metod w klasach serwisowych.
- Użycie `responseUtil.createSuccessResponse()` do tworzenia odpowiedzi 200 OK.
- Dedykowane bloki `catch` dla `UserNotAuthenticatedException` (zwraca 401) oraz innych specyficznych wyjątków biznesowych (zwracają odpowiednie statusy błędów, np. 400, 404).
- Ogólny blok `catch (Exception e)` do obsługi nieprzewidzianych błędów (zwraca 500).
- Przyjmowanie tokenu JWT jako `@RequestParam String token`.

## 4. Pakiet `security`

**Absolutnie nie wolno modyfikować kodu w pakiecie `com.auth.jwt.security`.** Konfiguracja bezpieczeństwa, filtry JWT i mechanizmy uwierzytelniania są ustalone i nie powinny być zmieniane w ramach tworzenia nowych funkcjonalności API.

## 5. Podział Kodu i Reużywalność

- **Serwisy**: Główna logika biznesowa, operacje na danych.
- **Klasy Pomocnicze (Utils)**: Wydzielaj reużywalne fragmenty kodu (np. skomplikowane obliczenia, transformacje danych, walidacje niezwiązane bezpośrednio z encją) do dedykowanych klas w pakiecie `util`. Wstrzykuj te utility do serwisów lub innych komponentów, gdzie są potrzebne.
- **Rozbijanie Logiki w Serwisach**: Zamiast tworzyć wiele prywatnych metod w obrębie tej samej klasy serwisowej, **preferuj wydzielanie złożonej lub reużywalnej logiki do dedykowanych klas pomocniczych** (np. w pakiecie `util` lub w dedykowanym podpakiecie serwisu). Wstrzykuj te klasy pomocnicze do serwisu. Utrzymuj metody w serwisach możliwie zwięzłe i skoncentrowane na orkiestracji.

