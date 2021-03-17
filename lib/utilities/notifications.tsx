import React from 'react';
import { toast } from "react-toastify";
import { NotificationWithConfirm } from "../components/Notifications";

type ShowConfirmNotificationParams = {
    title: string;
    text: string;
    onClick: (res: boolean) => void;
};

export function showConfirmNotification({ title, text, onClick }: ShowConfirmNotificationParams) {
    const toastId = toast.info(
        <NotificationWithConfirm 
            title={title}
            text={text}
            onClick={(res: boolean) => {
                onClick(res); 
                toast.dismiss(toastId);
            }}
        />, {
            closeButton: false,
            autoClose: false,
            closeOnClick: false
        }
    );
}
