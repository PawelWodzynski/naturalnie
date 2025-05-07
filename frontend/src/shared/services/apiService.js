const BASE_URL = "http://localhost:8080/api/app-data";

const fetchData = async (endpoint) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found for API request.");
    throw new Error("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
  }
  const encodedToken = encodeURIComponent(token);
  const url = `${BASE_URL}/${endpoint}?token=${encodedToken}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Nie udało się przetworzyć odpowiedzi błędu serwera." }));
      console.error(`API GET request failed for ${endpoint}: ${response.status} - ${errorData.message || "Nieznany błąd"}`);
      throw new Error(`Błąd serwera (GET ${endpoint}): ${response.status} - ${errorData.message || "Nieznany błąd"}`);
    }
    const result = await response.json();
    if (result && result.data && Array.isArray(result.data)) {
        return result.data; 
    } else if (result && result.data && !Array.isArray(result.data)) {
        // Handle cases where a single object might be returned under data, though GETs usually return arrays for lists
        console.warn(`API GET response for ${endpoint} returned a single object under data, expected array. Wrapping in array.`);
        return [result.data]; 
    }    
    else {
        console.error(`API GET response for ${endpoint} does not contain 'data' array or expected structure:`, result);
        throw new Error(`Nieprawidłowa odpowiedź API dla ${endpoint}.`);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

const postData = async (endpoint, body) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found for API POST request.");
    throw new Error("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
  }
  const encodedToken = encodeURIComponent(token);
  const url = `${BASE_URL}/${endpoint}?token=${encodedToken}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseBody = await response.json().catch(() => {
        // If response is not JSON or empty, but still ok, it might be a 201 Created with no body
        if (response.ok) return { success: true, message: "Operacja zakończona pomyślnie, brak treści odpowiedzi.", data: body }; // Simulate data for consistency
        return { message: "Nie udało się przetworzyć odpowiedzi serwera (nie-JSON)." };
    });

    if (!response.ok) {
      console.error(`API POST request failed for ${endpoint}: ${response.status} - ${responseBody.message || "Nieznany błąd"}`);
      throw new Error(`Błąd serwera (POST ${endpoint}): ${response.status} - ${responseBody.message || "Nieznany błąd"}`);
    }
    
    // Ensure the response structure is consistent, especially the 'data' field for the new item
    if (responseBody && responseBody.success) {
        return responseBody; // Expecting { data: { new_item_details }, success: true, message: "..." }
    } else {
        console.error(`API POST response for ${endpoint} indicates failure or unexpected structure:`, responseBody);
        throw new Error(responseBody.message || `Nieudane żądanie POST do ${endpoint}.`);
    }

  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

// GET functions
export const fetchRodzajeProduktu = () => fetchData("rodzaj-produktu");
export const fetchJednostki = () => fetchData("jednostka");
export const fetchNadKategorie = () => fetchData("nad-kategoria");
export const fetchOpakowania = () => fetchData("opakowanie");
export const fetchStawkiVat = () => fetchData("stawka-vat");

// POST functions for adding new options
export const addRodzajProduktu = (data) => postData("rodzaj-produktu", data);
export const addJednostka = (data) => postData("jednostka", data);
export const addNadKategoria = (data) => postData("nad-kategoria", data);
export const addOpakowanie = (data) => postData("opakowanie", data);
export const addStawkaVat = (data) => postData("stawka-vat", data);

