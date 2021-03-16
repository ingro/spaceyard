import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { FiX } from 'react-icons/fi';
import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';

import '../styles/dialogs.css';

function DefaultErrorFallback({ error }) {
    return (
        <div>
            {error.message}
        </div>
    );
}

type ModalProps = {
    children: any;
    dismissable?: boolean;
    onClose: () => void;
    size?: 'small' | 'medium' | 'large';
    labelId: string;
    ErrorFallback?: any;
};

export function Modal({ 
    onClose, 
    children, 
    labelId,
    size = 'medium',
    dismissable = true,
    ErrorFallback = DefaultErrorFallback
}: ModalProps) {
    const handleDismiss = dismissable ? onClose : () => {};

    return (
        <DialogOverlay
            className="z-20 lg:z-10"
            isOpen={true} 
            onDismiss={handleDismiss}
        >
            <DialogContent
                className={clsx('w-11/12 dark:bg-gray-700', {
                    'lg:max-w-md xl:max-w-lg 2xl:max-w-xl': size === 'small',
                    'lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl': size === 'medium',
                    'lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl': size === 'large'
                })}
                aria-labelledby={labelId}
            >
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    {children}
                </ErrorBoundary>
            </DialogContent>
        </DialogOverlay>
    );
}

type ModalTitleProps = {
    showCloseButton?: boolean;
    onClose: any;
    children: any;
    labelId: string;
};

export function ModalTitle({ showCloseButton = true, onClose, labelId, children }: ModalTitleProps) {
    return (
        <div className="pt-2 pb-3 px-3 lg:px-6 flex justify-between items-center">
            <p className="text-2xl font-bold dark:text-white" id={labelId}>{children}</p>
            {showCloseButton && (
                <div className="cursor-pointer dark:text-white place-self-start -mr-1 hover:text-gray-500 dark:hover:text-gray-300" onClick={onClose}>
                    <FiX className="w-6 h-6"/>
                </div>
            )}
        </div>
    );
}

export function ModalBody({ children }: any) {
    return (
        <div className="flex-grow py-2 px-3 lg:px-6 text-left overflow-y-auto">
            {children}
        </div>
    );
}

export function ModalFooter({ children }: any) {
    return (
        <div className="py-2 px-3 lg:px-6 flex justify-end pt-2 pb-2">
            {children}
        </div>
    );
}
