import React from "react";

import '../styles/form.css';
import '../styles/dropdowns.css';
import '../styles/dialogs.css';
import '../styles/datepicker.css';

export function SpaceyardStyleProvider({ children }: any) {
    return (
        <div>
            {children}
        </div>
    );
}
