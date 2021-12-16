import React from 'react';
import FocusLock from 'react-focus-lock';
import { toast } from 'react-toastify';
// import { FiCheckSquare, FiAlertTriangle, FiAlertCircle, FiItalic } from 'react-icons/fi';

type NotificationWithConfirmProps = {
    onClick: (res: boolean) => void;
    title: string;
    text: string;
    cancelLabel?: string;
    confirmLabel?: string;
};

export function NotificationWithConfirm({ onClick, title, text, cancelLabel = 'Annulla', confirmLabel = 'Conferma' }: NotificationWithConfirmProps) {
    return (
        <div>
            <FocusLock
                autoFocus={true}
                returnFocus={true}
            >
                {/* <div className="shrink-0 mr-2">
                    <FiAlertCircle className="w-5 h-5" />
                </div> */}
                <div className="grow">
                    <span className="font-bold block">{title}</span>
                    <span className="font-normal">{text}</span>
                </div>
                <div className="flex justify-items-stretch mt-2">
                    <div className="flex-1 mr-1"><button className="btn w-full btn-link" onClick={() => onClick(false)}>{cancelLabel}</button></div>
                    <div className="flex-1 ml-1"><button className="btn w-full btn-primary" onClick={() => onClick(true)}>{confirmLabel}</button></div>
                </div>
            </FocusLock>
        </div>
    );
}

type BasicNotificationProps = {
    title?: string;
    text: string;
    // type?: string;
};

export function BasicNotification({ title, text }: BasicNotificationProps) {
    // let Icon = null;

    // switch (type) {
    //     case 'info':
    //     default: 
    //         Icon = FiItalic;
    //         break;
    //     case 'success':
    //         Icon = FiCheckSquare;
    //         break;
    //     case 'warn':
    //         Icon = FiAlertCircle;
    //         break;
    //     case 'error':
    //         Icon = FiAlertTriangle;
    //         break;
    // }

    return (
        <div>
            {title &&
                <span className="font-bold block">{title}</span>
            }
            <span className="font-normal">{text}</span>
        </div>
    );
}

type loadingNotificationProps = {
    promise: Promise<any>;
    loadingMessage?: string;
    resolveMessage: string;
    rejectMessage: string;
};

export async function loadingNotification({ promise, loadingMessage = 'Attendere prego...', resolveMessage, rejectMessage }: loadingNotificationProps) {
    const id = toast.loading(loadingMessage, { type: 'info' });

    promise.then(() => {
        toast.update(id, { render: <BasicNotification text={resolveMessage} />, type: "success", isLoading: false, closeOnClick: null, autoClose: null });
    }, () => {
        toast.update(id, { render: <BasicNotification text={rejectMessage} />, type: "error", isLoading: false, closeOnClick: null, autoClose: null });
    });

    return promise;
}

type showConfirmNotificationProps = {
    title: string;
    text: string;
    onClick: (res: boolean) => void;
};

export function showConfirmNotification({ title, text, onClick }: showConfirmNotificationProps) {
    const toastId = toast.info(<NotificationWithConfirm title={title} text={text} onClick={res => {
        onClick(res);
        toast.dismiss(toastId);
    }} />, { 
        closeButton: false,
        autoClose: false,
        closeOnClick: false 
    });
}
