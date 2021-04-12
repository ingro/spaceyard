import React from 'react';
import { Redirect } from 'react-router-dom';

import { useAppContext } from '../hooks/useAppContext';

export const MatchWhenGuest = (WrappedComponent: any) => {
    return function MatchWhenGuestComponent(props: any) {
        const { user, appRoutes } = useAppContext();

        if (user === null) {
            return <WrappedComponent {...props} />;
        }

        return <Redirect to={appRoutes.home} />;
    }
};
