import React, { Suspense } from 'react';
import {
    // BrowserRouter,
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    // Routes,
    Route,
    NavLink,
    Outlet
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

function Logout() {
    return (
        <div>Logging out...</div>
    )
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootProper />}>
            <Route index={true} element={<App />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/overlays" element={<Overlays />}/>
            <Route path="/datatable" element={<DataGrid />}/>
            <Route path="/omnibox" element={<OmniboxPage />}/>
            <Route path="/logout" element={<Logout />}/>
        </Route>
    )
);

function RootProper() {
    return (
        <div className="px-2 pt-2">
            <Suspense fallback={<span>Loading...</span>}>
                <AppProvider
                    appStorage={appStorage}
                    appRoutes={{
                        login: '/login',
                        logout: '/logout',
                        home: '/'
                    }}
                >
                    <div className='fixed w-full flex h-10 top-0 left-0 bg-slate-600 text-white items-center'>
                        <div className='text-bold text-xl ml-2'><NavLink to="/">SPACEYARD</NavLink></div>
                        <NavLink className="text-red-500 ml-2" to="/logout">Logout</NavLink>
                    </div>
                    <div className='mt-12'>
                        <Outlet />
                    </div>
                    <ToastContainer />
                </AppProvider>
            </Suspense>
        </div>
    );
}

export default function Root() {
    return <RouterProvider router={router}/ >;
}