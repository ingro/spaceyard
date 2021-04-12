import React from 'react';

import { AppContextType } from '../types';

const AppContext = React.createContext<AppContextType>({ 
    isMinimized: false, 
    user: null,
    appRoutes: {
        login: '/login',
        logout: '/logout',
        home: '/home'
    },
    setIsMinimized: (value: any) => {}, 
    setUser: (user: any) => {}, 
    setLanguage: (language: string) => {} 
});

export default AppContext;
