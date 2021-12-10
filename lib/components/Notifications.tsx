import React from 'react';
import FocusLock from 'react-focus-lock';
import { FiCheckSquare, FiAlertTriangle, FiAlertCircle, FiItalic } from 'react-icons/fi';

type NotificationWithConfirmProps = {
    onClick: (res: boolean) => void;
    title: string;
    text: string;
    cancelLabel?: string;
    confirmLabel?: string;
}

export function NotificationWithConfirm({ onClick, title, text, cancelLabel = 'Annulla', confirmLabel = 'Conferma' }: NotificationWithConfirmProps) {
    return (
        <div>
            <FocusLock
                autoFocus={true}
                returnFocus={true}
            >
                <div className="flex">
                    <div className="shrink-0 mr-2">
                        <FiAlertCircle className="w-5 h-5" />
                    </div>
                    <div className="grow">
                        <span className="font-bold block">{title}</span>
                        <span className="font-normal">{text}</span>
                    </div>
                </div>
                <div className="flex justify-items-stretch mt-2">
                    <div className="flex-1 mr-1"><button className="btn w-full btn-link bg-white" onClick={() => onClick(false)}>{cancelLabel}</button></div>
                    <div className="flex-1 ml-1"><button className="btn w-full bg-primary" onClick={() => onClick(true)}>{confirmLabel}</button></div>
                </div>
            </FocusLock>
        </div>
    );
}

type NotificationWithTitleProps = {
    title: string;
    text: string;
    type?: string;
};

export function NotificationWithTitle({ title, text, type }: NotificationWithTitleProps) {
    let Icon = null;

    switch (type) {
        case 'info':
        default: 
            Icon = FiItalic;
            break;
        case 'success':
            Icon = FiCheckSquare;
            break;
        case 'warn':
            Icon = FiAlertCircle;
            break;
        case 'error':
            Icon = FiAlertTriangle;
            break;
    }

    return (
        <div className="flex">
            <div className="shrink-0 mr-2">
                <Icon className="w-5 h-5" />
            </div>
            <div className="grow">
                <span className="font-bold block">{title}</span>
                <span className="font-normal">{text}</span>
            </div>
        </div>
    );
}
