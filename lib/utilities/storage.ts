import { useState } from 'react';
import Basil from 'basil.js';
import useEventListener from '@use-it/event-listener';

export function createAppStorage(appName: string) {
    const storage = new Basil({
        namespace: appName,
        keyDelimiter: '::',
        storages: ['local']
    });

    function setData(key: string, value: any) {
        storage.set(key, value);
    
        const event = new StorageEvent('storage', {
            key: `${appName}::${key}`,
            newValue: JSON.stringify(value)
        });
    
        window.dispatchEvent(event);
    }

    // window.addEventListener('storage', ({ key, newValue }) => {
    //     // console.log(key, newValue);
    //     const re = new RegExp(`^${appName}::`, 'i');

    //     if (key && re.test(key)) {
    //         const cleanKey = key.replace(`${appName}::`, '');

    //         if (newValue) {
    //             storage.set(cleanKey, JSON.parse(newValue));
    //         }
    //     }
    // });

    return {
        set: setData,
        get: (key: string) => storage.get(key),
        clear: () => storage.reset(),
        getFullKey: (key: string) => `${appName}::${key}`,
        getStorage: () => storage,
        useLocalStorage: (key: string, initialValue: any, sync = false) => {
            const [storedValue, setStoredValue] = useState(storage.get(key) || initialValue);

            const setValue = (value: any) => {
                storage.set(key, value);
                setStoredValue(value);
            };

            useEventListener('storage', ({ key: eventKey, newValue }: any) => {
                if (sync) {
                    if (eventKey === `${appName}::${key}`) {
                        // const cleanKey = key.replace(`${appName}::`, '');

                        if (JSON.stringify(storedValue) !== newValue) {
                            const newStoredValue = JSON.parse(newValue);
                            setStoredValue(newStoredValue);
                        }
                        
                        // if (newValue) {
                        //     storage.set(cleanKey, JSON.parse(newValue));
                        // }
                    }
                }
            });
            
            
            return [storedValue, setValue];
        }
    };
}
