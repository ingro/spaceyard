import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';

import './index.css';
import './i18n';
import App from './App';

if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
}

// @ts-ignore
const root = createRoot(document.getElementById('root'));

root.render(
    <Suspense fallback={null}>
        <App />
    </Suspense>
);
