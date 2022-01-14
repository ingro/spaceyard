import React from "react";

type AppRouteNames = 'login' | 'logout' | 'home';

export type AppRoutes = Record<AppRouteNames, string>;

export type AppContextType = {
    appRoutes: AppRoutes;
    user: any | null;
    isMinimized: boolean;
    appStorage: any;
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

export type DashboardWidgedSizes = 'sm' | 'md' | 'lg' | 'xl';

export type DashboardWidgetExtraConfig = {
    name: string;
    label: string;
    type: 'choice' | 'bool';
    choices: Array<SelectOption>,
    value: any
};

export type DashboardWidgetConfigStatic = {
    name: string;
    minHeight?: number;
    extras: Array<DashboardWidgetExtraConfig>;
};

export interface DashboardWidgetConfig extends DashboardWidgetConfigStatic {
    code: string;
    size: DashboardWidgedSizes;
    active: boolean;
};