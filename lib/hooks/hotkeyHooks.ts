import { useEffect } from 'react';
import { tinykeys } from 'tinykeys';

export const useInputFocusKey = (inputRef: any, key: string = '/') => {
    useEffect(() => {
        if (inputRef === null) {
            return;
        }
        
        let unsubscribe = tinykeys(window, {
            [key]: (e: any) => {
                e.preventDefault();

                if (inputRef && inputRef.current) {
                    // @ts-ignore
                    inputRef.current.focus();
                }
            }
        });

        return () => {
            unsubscribe();
        }
    });
}

export const useGlobalHotKey = (key: string, fn: Function) => {
    useEffect(() => {
        let unsubscribe = tinykeys(window, {
            [key]: (e: any) => {
                e.preventDefault();

                fn();
            }
        });

        return () => {
            unsubscribe();
        }
    });
}

export const useLocalHotkey = (key: string, fn: Function, targetElement: any) => {
    useEffect(() => {
        let unsubscribe = targetElement.current 
        ? tinykeys(targetElement.current, {
            [key]: (e: any) => {
                e.preventDefault();

                fn();
            }
        })
        : () => {};

        return () => {
            unsubscribe();
        }
    }, [key, targetElement, fn]);
}

export const useFocusFirstTableButtonKey = () => {
    useEffect(() => {
        let unsubscribe = tinykeys(window, {
            'Control+1': (e: any) => {
                e.preventDefault();

                const buttons = document.getElementsByClassName('--btn-row-primary');

                if (buttons.length > 0) {
                    // @ts-ignore
                    buttons[0].focus();
                }
            }
        });

        return () => {
            unsubscribe();
        }
    });
}
