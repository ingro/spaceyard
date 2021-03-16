import create, { UseStore } from 'zustand';

import { OmniBoxAction, OmniBoxActionsState } from '../types';

export function createOmniboxActionsStore(actions: Array<OmniBoxAction>): UseStore<OmniBoxActionsState> {
    const wat = create<OmniBoxActionsState>(set => ({
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
