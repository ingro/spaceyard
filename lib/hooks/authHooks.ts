import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAppContext } from './useAppContext';

export function useIsAuth() {
    const { user, appRoutes } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate(appRoutes.login, {
                state :{
                    from: location, 
                    error: 'Sessione scaduta'
                }
            });
        }
    }, [user, location, navigate]);

    return user;
}

export function useIsGuest(redirectPath?: string) {
    const { user, appRoutes } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(redirectPath || appRoutes.home);
        }
    }, [user, navigate, redirectPath]);

    return user;
}
