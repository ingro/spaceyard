import React from 'react';
import { FormState } from 'react-hook-form';
import { FiCheck, FiX } from 'react-icons/fi';

export function CancelModalButton({ onClose, label = 'Chiudi' }: any) {
    return (
        <button onClick={onClose} className="btn btn-link btn-lg --modal-dialog-cancel-btn">{label}</button>
    );
}

type FormSubmitButtonProps = {
    formState: FormState<any>;
    onClick: () => void;
    children: any;
};

export function FormSubmitButton({ formState, onClick, children }: FormSubmitButtonProps) {
    return (
        <button 
            className="btn btn-primary form-submit-btn"
            onClick={() => onClick()}
            disabled={formState.isSubmitting || !formState.isValid} // || formState.isSubmitSuccessful
        >
            <FiCheck /> {children}
        </button>
    );
}

type CloseModalButtonProps = {
    onClose: () => void;
};

export function CloseModalButton({ onClose }: CloseModalButtonProps) {
    return (
        <div 
            className="inline-block cursor-pointer dark:text-white place-self-start -mr-1 hover:bg-gray-200 dark:hover:text-gray-300" 
            onClick={onClose}
        >
            <FiX className="w-6 h-6"/>
        </div>
    );
}
