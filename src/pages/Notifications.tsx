import React from 'react';
import { toast } from 'react-toastify';

import { BasicNotification, loadingNotification, showConfirmNotification } from '../../lib/components/Notifications';

export default function Notifications() {
    return (
        <div>
            <div className="flex flex-col space-y-1 mt-4 w-64">
                <button className="btn" onClick={() => toast.success(<BasicNotification text="Hurray!"/>)}>Show Notification</button>
                <button className="btn" onClick={() => toast(<BasicNotification title="Foo" text="Hurray!"/>)}>Show Notification with Title</button>
                <button className="btn" onClick={() => showConfirmNotification({ title: 'Action needed', text: 'Do you agree?', onClick: res => console.log(res)})}>Show Confirm Notification</button>
                <button className="btn" onClick={() => {
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));

                    loadingNotification({
                        promise: resolveAfter3Sec,
                        resolveMessage: 'Hurray :)',
                        rejectMessage: 'Oh noes :('
                    });
                }}>
                    Show Loading notification
                </button>
            </div>
        </div>
    );
}