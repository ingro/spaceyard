import React from 'react';

import { AppContextType } from '../types';

const AppContext = React.createContext<AppContextType>({ isMinimized: false, setIsMinimized: (value: any) => {}, user: null, setUser: (user: any) => {}, setLanguage: (language: string) => {} });

export default AppContext;
