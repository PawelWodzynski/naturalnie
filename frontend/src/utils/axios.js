import axios from 'axios';

// Konfiguracja bazowego URL
const baseURL = process.env.NODE_ENV === 'production' 
  ? '/'  // w produkcji (kontener) używaj relatywnego URL
  : 'http://localhost:8080';  // w developmencie lokalnym

// Konfiguracja domyślnych ustawień globalnie
axios.defaults.baseURL = baseURL;

// Interceptory do logowania
axios.interceptors.request.use(
  (config) => {
    console.log('Axios Request:', config);
    return config;
  }, 
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', response);
    return response;
  },
  (error) => {
    console.error('Axios Response Error:', error.response || error.message);
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access - redirecting to login');
      // Opcjonalnie: przekierowanie do strony logowania
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Eksportuj domyślną instancję axios (która teraz jest skonfigurowana)
export default axios;