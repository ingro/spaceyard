import React from 'react';

export default function DefaultErrorFallback({ error }: any) {
    return (
        <div>
            {error.message}
        </div>
    );
}
