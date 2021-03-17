import React from 'react';
import { FormState } from 'react-hook-form';
import { FiCheck } from 'react-icons/fi';

export function CloseModalButton({ onClose, label = 'Chiudi' }: any) {
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