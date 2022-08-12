import React from 'react';

import { AppContextType } from '../types';

const AppContext = React.createContext<AppContextType>({ 
    isMinimized: false, 
    user: null,
    appStorage: null,
    dateLocale: null,
    appRoutes: {
        login: '/login',
        logout: '/logout',
        home: '/home'
    },
    setDateLocale: (dateLocale: any) => {},
    setIsMinimized: (value: any) => {}, 
    setUser: (user: any) => {}, 
    setLanguage: (language: string) => {} 
});

export default AppContext;
