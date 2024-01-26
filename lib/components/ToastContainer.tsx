import React from 'react';
import { ToastContainer as RcToastContainer, cssTransition, toast } from "react-toastify";
import clsx from 'clsx';

const slideTransition = cssTransition({
    enter: 'toast-slide-enter',
    exit: 'toast-slide-exit',
    collapse: false
});

function getTypeClass(type: string, typeClasses: any) {
    if (typeClasses[type]) {
        return typeClasses[type];
    }

    switch (type) {
        case 'info':
            return 'bg-info';
        case 'success':
            return 'bg-success';
        case 'warning':
            return 'bg-warning';
        case 'error':
            return 'bg-danger';
        case 'default':
        default:
            return 'bg-white text-slate-700';
    }
}

type ToastContainerProps ={
    autoClose?: number;
    closeOnClick?: boolean;
    closeButton?: boolean;
    typeClasses?: any
};

export function ToastContainer({ autoClose = 10000, closeOnClick = true, closeButton = false, typeClasses = {}}: ToastContainerProps) {
    return (
        <RcToastContainer
            className={({ position }: any) => {
                return clsx('z-100 fixed p-0 md:p-2 m-0 text-white w-full md:w-96', {
                    'bottom-0 md:pb-1 transform -translate-x-1/2 left-1/2': position === 'bottom-center'
                });
            }}
            toastClassName={({ type }: any) => {
                return clsx('flex relative mb-0 md:mb-4 p-3 justify-between overflow-hidden cursor-pointer md:rounded-md w-full text-gray-200 font-semibold min-h-20 md:shadow-lg', getTypeClass(type, typeClasses));
            }}
            // bodyClassName=""
            position="bottom-center"
            hideProgressBar={true}
            transition={slideTransition}
            icon={true}
            autoClose={autoClose}
            closeOnClick={closeOnClick}
            closeButton={closeButton}
        />
    );
}