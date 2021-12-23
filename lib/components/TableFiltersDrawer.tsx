import React from "react";
import { MoveFocusInside } from "react-focus-lock";

import { Drawer } from "./Drawer";

type TableFiltersDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    children: any;
};

export function TableFiltersDrawer({ children, onClose, isOpen }: TableFiltersDrawerProps) {
    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            showOverlay={false}
            dismissable={true}
            className="drawer-dialog-filters"
        >
            <MoveFocusInside>
                <div className="space-y-2">
                    <span className="text-xl">Filtri avanzati</span>
                    {children}
                </div>
            </MoveFocusInside>
        </Drawer>
    );
}
