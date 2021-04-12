import React from "react";

type AppRouteNames = 'login' | 'logout' | 'home';

export type AppRoutes = Record<AppRouteNames, string>;

export type AppContextType = {
    appRoutes: AppRoutes;
    user: any | null;
    isMinimized: boolean;
    setUser: (user: any) => void;
    setIsMinimized: (isMinimized: boolean) => void;
    setLanguage: (language: string) => void;
};

export type OmniBoxAction = {
    value: string | (() => void);
    label: string;
    Icon: React.ElementType;
    key: string;
};

export type OmniBoxActionsState = {
    actions: Array<OmniBoxAction>;
    addActions: (actions: Array<OmniBoxAction> | OmniBoxAction) => void;
    removeActionsByKeys: (keys: Array<string>) => void;
};

export type SelectOption = {
    value: string|number,
    label: string
};

export type LocalizedDateFormat = 'full' | 'dateOnly' | 'timeOnly' | 'long';