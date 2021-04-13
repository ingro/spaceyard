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
        loadedLocale = await import(/* @vite-ignore */ `date-fns/locale/${languageToLoad}/index.js`);
    } catch (err) {
        console.error(`Unable to load translations for locale "${languageToLoad}", falling back to "${fallBackLng}"`);

        try {
            loadedLocale = await import(/* @vite-ignore */ `date-fns/locale/${fallBackLng}/index.js`);
        } catch (err) {
            // @ts-ignore
            if (import.meta.env.DEV) {
                loadedLocale = await import('date-fns/locale/it/index.js');
            }
        }
    }

    cb(loadedLocale);
}
