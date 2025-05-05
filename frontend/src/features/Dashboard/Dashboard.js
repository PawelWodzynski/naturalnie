import { useState, useEffect } from "react";
import axios from "axios"; // Ensure this path is correct
import { useTranslation } from 'react-i18next';
import { LineChart } from 'recharts'; // Import only what's needed for checks
import { FaReact } from 'react-icons/fa'; // Import only what's needed for checks

// Default chart data (can be moved to a constants file)
const defaultChartData = [
  { name: 'Sty', uv: 4000, pv: 2400 },
  { name: 'Lut', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 },
  { name: 'Kwi', uv: 2780, pv: 3908 },
  { name: 'Maj', uv: 1890, pv: 4800 },
];

export const useDashboardLogic = () => {
  const { t } = useTranslation(); // Keep t for potential top-level translations

  // --- State Management ---
  const [libraryStatus, setLibraryStatus] = useState({
    tailwind: null, // Initialize as null, check in useEffect
    recharts: null,
    reactIcons: null,
    i18next: null,
    axios: null
  });

  const [apiAuthStatus, setApiAuthStatus] = useState({
    loading: false,
    success: null,
    message: '',
    error: null,
    data: null
  });

  const [chartData] = useState(defaultChartData); // Keep chart data simple for now

  // --- Effects for Library Checks ---
  useEffect(() => {
    let isMounted = true;

    // Check Tailwind (simple DOM manipulation check)
    try {
      const testElement = document.createElement('div');
      testElement.className = 'bg-red-500'; // Use a known Tailwind class
      document.body.appendChild(testElement);
      const hasClass = testElement.classList.contains('bg-red-500');
      document.body.removeChild(testElement);
      if (isMounted) setLibraryStatus(prev => ({ ...prev, tailwind: hasClass }));
    } catch (error) {
      if (isMounted) setLibraryStatus(prev => ({ ...prev, tailwind: false }));
    }

    // Check Recharts (check if core component exists)
    if (isMounted) setLibraryStatus(prev => ({ ...prev, recharts: !!LineChart }));

    // Check React Icons (check if a core icon exists)
    if (isMounted) setLibraryStatus(prev => ({ ...prev, reactIcons: !!FaReact }));

    // Check i18next (try a translation)
    try {
      t('test.key', 'fallback'); // Simple translation attempt
      if (isMounted) setLibraryStatus(prev => ({ ...prev, i18next: true }));
    } catch (error) {
      if (isMounted) setLibraryStatus(prev => ({ ...prev, i18next: false }));
    }

    // Check Axios (check if imported object exists)
    if (isMounted) setLibraryStatus(prev => ({ ...prev, axios: !!axios }));

    return () => {
      isMounted = false;
    };
  }, [t]); // Add t to dependency array as it's used in the effect

  // --- API Call Logic ---
const testApiAuthorization = async () => {
  setApiAuthStatus({ loading: true, success: null, message: '', error: null, data: null });
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token nie został znaleziony w localStorage');
    }
    
    // Użyj fetch zamiast axios z pełnym URL
    const encodedToken = encodeURIComponent(token);
    const response = await fetch(`http://localhost:8080/example/test?token=${encodedToken}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Sprawdź status odpowiedzi
    if (!response.ok) {
      throw new Error(`Serwer zwrócił status: ${response.status}`);
    }
    
    // Przekształć odpowiedź na JSON
    const data = await response.json();
    
    setApiAuthStatus({
      loading: false,
      success: true,
      message: data?.message || 'Autoryzacja API działa poprawnie',
      error: null,
      data: data?.data || null
    });
  } catch (error) {
    console.error('Błąd API:', error);
    
    setApiAuthStatus({
      loading: false,
      success: false,
      message: '',
      error: error.message || 'Wystąpił błąd podczas autoryzacji API',
      data: null
    });
  }
};

// --- Return values ---
return {
  libraryStatus,
  apiAuthStatus,
  chartData,
  testApiAuthorization,
  // No need to return individual expand states, handled within sections
};
}
