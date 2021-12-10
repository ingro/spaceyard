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
        case toast.TYPE.INFO:
            return 'bg-slate-600';
        case toast.TYPE.SUCCESS:
            return 'bg-success';
        case toast.TYPE.WARNING:
            return 'bg-warning';
        case toast.TYPE.ERROR:
            return 'bg-danger';
        case toast.TYPE.DEFAULT:
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
                    'bottom-0 md:pb-1 transform -translate-x-1/2 left-1/2': position === toast.POSITION.BOTTOM_CENTER
                });
            }}
            toastClassName={({ type }: any) => {
                return clsx('flex relative mb-0 md:mb-4 p-3 justify-between overflow-hidden cursor-pointer md:rounded-md w-full text-gray-200 font-semibold min-h-20 md:shadow-lg', getTypeClass(type, typeClasses));
            }}
            bodyClassName="my-auto mx-0 flex-1"
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