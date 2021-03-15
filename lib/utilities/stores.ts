import create, { UseStore } from 'zustand';

import { OmniboxAction, OmniboxActionsState } from '../types';

export function createOmniboxActionsStore(actions: Array<OmniboxAction>): UseStore<OmniboxActionsState> {
    const wat = create<OmniboxActionsState>(set => ({
        actions,
        addActions: (actions: any) => {
            set((state: any) => ({ actions: state.actions.concat(actions) }));
        },
        removeActionsByKeys: (keys: Array<string>) => {
            set((state: any) => ({ actions: state.actions.filter((action: any) => ! keys.includes(action.key)) }));
        }
    }));

    return wat;
}
