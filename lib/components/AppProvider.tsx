import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useEventListener from "@use-it/event-listener";

import AppContext from "../contexts/AppContext";
import { AppContextType, AppRoutes } from "../types";

type AppProviderProps = {
    children: any;
    appStorage: any;
    appRoutes: AppRoutes
};

export function AppProvider({ children, appStorage, appRoutes }: AppProviderProps) {
    const [isMinimized, setIsMinimized] = useState(true);
    const [user, setUser] = useState(appStorage.get('user'));
    const languageRef = useRef(appStorage.get('language'));

    const { i18n } = useTranslation();

    const AppContextValue: AppContextType = {
        isMinimized, 
        setIsMinimized,
        user,
        appStorage,
        appRoutes,
        setUser: (userValue: any) => {
            setUser(userValue);
            appStorage.set('user', userValue);
        },
        setLanguage: (language: string) => {
            //setLanguage(language);
            i18n.changeLanguage(language);
            languageRef.current = language;
            appStorage.set('language', language);
        }
    };

    useEventListener('storage', ({ key, newValue }: any) => {
        if (key === appStorage.getFullKey('user')) {
            if (JSON.stringify(user) !== newValue) {
                const newUserValue = JSON.parse(newValue);
                setUser(newUserValue);
            }
        }
    });

    useEventListener('storage', ({ key, newValue }: any) => {
        if (key === appStorage.getFullKey('language')) {
            const newLanguage = JSON.parse(newValue);
            if (languageRef.current !== newLanguage) {
                languageRef.current = newLanguage;
                i18n.changeLanguage(newLanguage);
            }
        }
    });

    return (
        <AppContext.Provider value={AppContextValue}>
            {children}
        </AppContext.Provider>
    );
}
