import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        translation: {
          'test.message': 'Witaj w aplikacji!'
        }
      },
      en: {
        translation: {
          'test.message': 'Welcome to the app!'
        }
      }
    },
    lng: 'pl', // domyślny język
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
