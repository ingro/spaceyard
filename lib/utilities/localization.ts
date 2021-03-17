export async function loadDateLocale(language: string, cb: (locale: any) => void, fallBackLng: string | null = 'it') {
    let languageToLoad = language === 'default' ? navigator.language : language;

    if (languageToLoad === 'en') {
        languageToLoad = 'en-US';
    }

    if (languageToLoad === 'it-IT') {
        languageToLoad = 'it';
    }

    let loadedLocale = null;
    
    try {
        loadedLocale = await import(`date-fns/locale/${languageToLoad}`);
    } catch (err) {
        console.error(`Unable to load translations for locale "${languageToLoad}", falling back to "${fallBackLng}"`);

        loadedLocale = await import(`date-fns/locale/${fallBackLng}`);
    }

    cb(loadedLocale);
}
