import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppContext } from '../hooks/useAppContext';

export const MatchWhenAuth = (WrappedComponent: any) => {
    return function MatchWhenAuthComponent(props: any) {
        const { user, appRoutes } = useAppContext();
        const location = useLocation();

        if (user !== null) {
            return <WrappedComponent {...props} />;
        }

        return <Navigate 
            replace={true}
            state={{ 
                from: location, 
                error: 'Sessione scaduta' 
            }}
            to={appRoutes.login}
        />;
    }
};
