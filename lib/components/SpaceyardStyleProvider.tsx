import React from "react";

import '../styles/form.css';
import '../styles/dropdowns.css';
import '../styles/dialogs.css';

export function SpaceyardStyleProvider({ children }: any) {
    return (
        <div>
            {children}
        </div>
    );
}
