import React, { useState, useEffect, useRef } from 'react';
import { useLocalHotkey } from '../hooks/hotkeyHooks';
import FocusLock from 'react-focus-lock';

import { OmniBoxInput } from './OmniBoxInput';

type OmniBoxProps = {
    isOpen: boolean;
    onClose: () => void;
    actions: Array<any>;
};

export function OmniBox({ isOpen, onClose, actions }: OmniBoxProps) {
    const [isInputListOpen, setIsInputListOpen] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (inputRef && inputRef.current) {
                // @ts-ignore
                inputRef.current.focus();
            }
        } else {
            // Reimposto questo a true in ogni caso dato che Downshift mi avvisa solo al cambio del valore di isOpen
            // quindi quando apro l'Omnibox la seconda volta avrei ancora lo stato precedente che potrebbe essere
            // rimasto a false
            setIsInputListOpen(true);
        }
    }, [isOpen]);

    useLocalHotkey(
        'Escape', 
        () => { 
            if (isInputListOpen === false) { 
                onClose();
            }
        }, 
        inputRef
    );

    if (isOpen === false) {
        return null;
    }

    return (
        <div className="bg-gray-700 fixed inset-x-0 top-0 w-2/5 mx-auto mt-10 p-4 pt-6 z-100">
            <FocusLock
                autoFocus={true}
                returnFocus={true}
            >
                <OmniBoxInput 
                    onSelect={onClose} 
                    onIsOpenChange={(isOpen: boolean) => setIsInputListOpen(isOpen)} 
                    ref={inputRef}
                    options={actions}
                />
            </FocusLock>
        </div>
    );
}
