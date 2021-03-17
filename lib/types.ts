import React from "react";

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