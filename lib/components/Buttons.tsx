import React from 'react';
import { FormState } from 'react-hook-form';
import { FiCheck, FiX } from 'react-icons/fi';
import clsx from 'clsx';

export function CancelModalButton({ onClose, label = 'Chiudi' }: any) {
    return (
        <button onClick={onClose} className="btn btn-link btn-lg --modal-dialog-cancel-btn">{label}</button>
    );
}

type FormSubmitButtonProps = {
    formState: FormState<any>;
    onClick?: () => void;
    children: any;
};

export function FormSubmitButton({ formState, onClick = () => {}, children }: FormSubmitButtonProps) {
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
            className="inline-block cursor-pointer dark:text-white content-center p-0.5 -mr-1 hover:bg-gray-200 dark:hover:text-gray-300 rounded-full" 
            onClick={onClose}
        >
            <FiX className="w-6 h-6" style={{ display: 'block' }}/>
        </div>
    );
}

const LoadingAnimation = () => (
    <div className="lds-ellipsis pointer-events-none">
        <div />
        <div />
        <div />
        <div />
    </div>
);

type LoadingButtonProps = {
    children: any;
    className?: string;
    disabled?: boolean;
    isLoading: boolean;
    onClick?: () => void;
    type?: 'button' | 'reset' | 'submit';
}

export function LoadingButton({ children, className, disabled, isLoading, onClick, type = 'button' }: LoadingButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={clsx('btn', className)}
            onClick={onClick}
        >
            {isLoading 
                ? <LoadingAnimation /> 
                : children
            }
        </button>
    );
}
