import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';

import { useAppContext } from './useAppContext';

export function useIsAuth() {
    const { user, appRoutes } = useAppContext();
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (user === null) {
            history.push(appRoutes.login, {
                from: location, error: 'Sessione scaduta'
            });
        }
    }, [user, location, history]);

    return user;
}

export function useIsGuest(redirectPath?: string) {
    const { user, appRoutes } = useAppContext();
    const history = useHistory();

    useEffect(() => {
        if (user) {
            history.push(redirectPath || appRoutes.home);
        }
    }, [user, history, redirectPath]);

    return user;
}
