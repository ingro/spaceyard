import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './i18n';
import Root from './Root';

if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
}

// @ts-ignore
const root = createRoot(document.getElementById('root'));

root.render(
    <Suspense fallback={null}>
        <Root />
    </Suspense>
);
