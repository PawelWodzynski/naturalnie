import { useState, useCallback } from 'react';

const useProductSubmit = (formData, apiToken, onClose) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!apiToken) {
      setSubmitError("Brak tokenu autoryzacyjnego. Zaloguj się ponownie.");
      setIsSubmitting(false);
      return;
    }

    try {
      const encodedToken = encodeURIComponent(apiToken);
      const url = `http://localhost:8080/api/app-data/produkt?token=${encodedToken}`;
      const payload = {
        nazwa: formData.nazwa,
        waga: parseFloat(formData.waga) || 0,
        cena: parseFloat(formData.cena) || 0,
        superProdukt: formData.superProdukt,
        towarPolecany: formData.towarPolecany,
        rekomendacjaSprzedawcy: formData.rekomendacjaSprzedawcy,
        superCena: formData.superCena,
        nowosc: formData.nowosc,
        superjakosc: formData.superjakosc,
        rabat: formData.rabat,
        dostepny: formData.dostepny,
        dostepneOdReki: formData.dostepneOdReki,
        dostepneDo7Dni: formData.dostepneDo7Dni,
        dostepneNaZamowienie: formData.dostepneNaZamowienie,
        wartoKupic: formData.wartoKupic,
        bezglutenowy: formData.bezglutenowy,
        opis: formData.opis,
        rodzajProduktuNazwa: formData.rodzajProduktuNazwa,
        rodzajProduktuOpis: formData.rodzajProduktuOpis,
        jednostkaNazwa: formData.jednostkaNazwa,
        jednostkaSkrot: formData.jednostkaSkrot,
        nadKategoriaNazwa: formData.nadKategoriaNazwa,
        nadKategoriaOpis: formData.nadKategoriaOpis,
        nadKategoriaKolejnosc: parseInt(formData.nadKategoriaKolejnosc, 10) || 0,
        opakowanieNazwa: formData.opakowanieNazwa,
        opakowanieSkrot: formData.opakowanieSkrot,
        opakowanieOpis: formData.opakowanieOpis,
        stawkaVatWartosc: parseFloat(formData.stawkaVatWartosc) || 0,
        kodTowaruKod: formData.kodTowaruKod,
        kodEanKod: formData.kodEanKod,
        identyfikatorWartosc: formData.identyfikatorWartosc,
        skladniki: formData.skladniki,
        zdjecia: formData.zdjecia.map(img => ({ daneZdjecia: img.daneZdjecia, opis: img.opis, kolejnosc: img.kolejnosc }))
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Nie udało się przetworzyć odpowiedzi błędu serwera.' }));
        throw new Error(`Błąd serwera: ${response.status} - ${errorData.message || 'Nieznany błąd'}`);
      }

      alert('Produkt dodany pomyślnie!');
      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      setSubmitError(error.message || "Wystąpił nieoczekiwany błąd.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, apiToken, onClose]);

  return {
    isSubmitting,
    submitError,
    handleSubmit,
  };
};

export default useProductSubmit;

