import i18n from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export default i18n
    .use(i18nextHttpBackend)
    .use(initReactI18next)
    .init({
        lng: 'en' || 'it' || 'de',
        fallbackLng: 'it',
        // debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });
    