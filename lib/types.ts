export type OmniboxAction = {
    value: string | (() => void);
    label: string;
    Icon: any;
    key: string;
};

export type OmniboxActionsState = {
    actions: Array<OmniboxAction>;
    addActions: (actions: Array<OmniboxAction> | OmniboxAction) => void;
    removeActionsByKeys: (keys: Array<string>) => void;
};
