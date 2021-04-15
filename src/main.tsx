import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './i18n';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={null}>
            <App />
        </Suspense>
    </React.StrictMode>,
    document.getElementById('root')
);
