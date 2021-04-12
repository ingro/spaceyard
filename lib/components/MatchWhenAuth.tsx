import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { useAppContext } from '../hooks/useAppContext';

export const MatchWhenAuth = (WrappedComponent: any) => {
    return function MatchWhenAuthComponent(props: any) {
        const { user, appRoutes } = useAppContext();
        const location = useLocation();

        if (user !== null) {
            return <WrappedComponent {...props} />;
        }

        return <Redirect to={{
            pathname: appRoutes.login,
            state: { from: location, error: 'Sessione scaduta' }
        }} />;
    }
};
