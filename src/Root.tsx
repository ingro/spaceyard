import React, { Suspense } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    NavLink
} from 'react-router-dom';

import { ToastContainer } from '../lib/components/ToastContainer';
import { AppProvider } from '../lib/components/AppProvider';
import { createAppStorage } from '../lib/utilities/storage';

import App from './App';
import Dashboard from './pages/Dashboard';
import DataGrid from './pages/DataGrid';
import Forms from './pages/Forms';
import Notifications from './pages/Notifications';
import Overlays from './pages/Overlays';
import OmniboxPage from './pages/OmniboxPage';

const appStorage = createAppStorage('spaceyard');

export const useLocalStorage = appStorage.useLocalStorage;

export default function Root() {
    return (
        <div className="px-2 pt-2">
            <Suspense fallback={<span>Loading...</span>}>
                <AppProvider
                    appStorage={appStorage}
                    appRoutes={{
                        login: '/login',
                        logout: '/logout',
                        home: '/home'
                    }}
                >
                    <BrowserRouter>
                        <div className='fixed w-full flex h-10 top-0 left-0 bg-slate-600 text-white items-center'>
                            <div className='text-bold text-xl ml-2'><NavLink to="/">SPACEYARD</NavLink></div>
                        </div>
                        <div className='mt-12'>
                            <Switch>
                                <Route path="/" exact><App /></Route>
                                <Route path="/dashboard"><Dashboard /></Route>
                                <Route path="/forms"><Forms /></Route>
                                <Route path="/notifications"><Notifications /></Route>
                                <Route path="/overlays"><Overlays /></Route>
                                <Route path="/datatable"><DataGrid /></Route>
                                <Route path="/omnibox"><OmniboxPage /></Route>
                            </Switch>
                        </div>
                        <ToastContainer />
                    </BrowserRouter>
                </AppProvider>
            </Suspense>
        </div>
    );
}