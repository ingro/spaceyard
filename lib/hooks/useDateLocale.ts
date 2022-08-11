// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { FallbackLng } from "i18next";

// import { loadDateLocale } from "../utilities/localization";

// let LOCALES_CACHE: any = {};

// function getFallBackLngString(fallBackLng?: FallbackLng | false): string | null {
//     if (! fallBackLng) {
//         return null;
//     }

//     if (typeof fallBackLng === 'string') {
//         return fallBackLng;
//     }

//     if (Array.isArray(fallBackLng)) {
//         return fallBackLng[0];
//     }

//     return null;
// }

// export function useDateLocale(forceLanguage: string | null | undefined = null) {
//     let { i18n: { language, options } } = useTranslation();
    
//     if (forceLanguage) {
//         language = forceLanguage;
//     }

//     const [dateLocale, setDateLocale] = useState(LOCALES_CACHE[language] || null);

//     useEffect(() => {
//         loadDateLocale(language, (locale) => {
//             setDateLocale(locale);

//             LOCALES_CACHE = {
//                 [language]: locale
//             };
//         }, getFallBackLngString(options.fallbackLng))
//     }, [language]);

//     return { language, dateLocale };
// }
