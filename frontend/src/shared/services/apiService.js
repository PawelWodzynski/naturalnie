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
      console.error(`API request failed for ${endpoint}: ${response.status} - ${errorData.message || "Nieznany błąd"}`);
      throw new Error(`Błąd serwera: ${response.status} - ${errorData.message || "Nieznany błąd"}`);
    }
    const result = await response.json();
    if (result && result.data && Array.isArray(result.data)) {
        return result.data; // Return the array under the 'data' key
    } else {
        console.error(`API response for ${endpoint} does not contain 'data' array:`, result);
        throw new Error(`Nieprawidłowa odpowiedź API dla ${endpoint}.`);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const fetchRodzajeProduktu = () => fetchData("rodzaj-produktu");
export const fetchJednostki = () => fetchData("jednostka");
export const fetchNadKategorie = () => fetchData("nad-kategoria");
export const fetchOpakowania = () => fetchData("opakowanie");
export const fetchStawkiVat = () => fetchData("stawka-vat");

