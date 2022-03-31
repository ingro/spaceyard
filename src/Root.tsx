import React, { Suspense } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    NavLink
} from 'react-router-dom';

import { ToastContainer } from '../lib/components/ToastContainer';

import App from './App';
import Dashboard from './pages/Dashboard';
import Forms from './pages/Forms';
import Notifications from './pages/Notifications';
import Overlays from './pages/Overlays';

export default function Root() {
    return (
        <div className="px-2 pt-2">
            <Suspense fallback={<span>Loading...</span>}>
                <BrowserRouter>
                    <div className='flex'>
                        <div className='mr-2'>SPACEYARD</div>
                        <div><NavLink to='/'>Ritorna alla home</NavLink></div>
                    </div>
                    <Switch>
                        <Route path="/" exact><App /></Route>
                        <Route path="/dashboard"><Dashboard /></Route>
                        <Route path="/forms"><Forms /></Route>
                        <Route path="/notifications"><Notifications /></Route>
                        <Route path="/overlays"><Overlays /></Route>
                    </Switch>
                    <ToastContainer />
                </BrowserRouter>
            </Suspense>
        </div>
    );
}