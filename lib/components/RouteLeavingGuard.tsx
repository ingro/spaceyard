import React, { useState, useEffect } from 'react';
import { Prompt, useHistory } from 'react-router';

import { useAppContext } from '../hooks/useAppContext';
import { useDisclosure } from '../hooks/useDisclosure';
import { ConfirmDialog } from './ConfirmDialog';

type RouteLeavingGuardProps = {
    when?: boolean | undefined;
    title?: string;
    text: string;
    shouldBlockNavigation?: (location: Location) => boolean;
    // navigate: (path: string) => void;
};

// Ispirato da https://medium.com/@michaelchan_13570/using-react-router-v4-prompt-with-custom-modal-component-ca839f5faf39

export function RouteLeavingGuard({
    when,
    title = 'Attenzione',
    text,
    shouldBlockNavigation = () => true,
    // navigate,
}: RouteLeavingGuardProps) {
    const { isOpen, open, close } = useDisclosure(false);
    const [lastLocation, setLastLocation] = useState<Location | null>(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);
    const { appRoutes } = useAppContext();

    const history = useHistory();

    const handleBlockedNavigation = (nextLocation: any) => {
        // Bypasso la verifica se ho gia deciso di effettuare il logout dall'applicazione
        if (nextLocation && nextLocation.pathname === appRoutes.logout) {
            setConfirmedNavigation(true);
        }

        if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
            open();
            setLastLocation(nextLocation);

            return false;
        }

        return true;
    };

    const handleConfirmNavigationClick = () => {
        close();
        setConfirmedNavigation(true);
    }; 

    useEffect(() => {
        if (confirmedNavigation && lastLocation) {
            // Navigate to the previous blocked location with your navigate function
            // navigate(lastLocation.pathname);
            history.push(lastLocation);
        }
        // eslint-disable-next-line
    }, [confirmedNavigation, lastLocation]);

    return (
        <>
            <Prompt when={when} message={handleBlockedNavigation} />
            {isOpen && (
                <ConfirmDialog 
                    title={title}
                    onCancel={close}
                    onConfirm={handleConfirmNavigationClick}
                >
                    {text}
                </ConfirmDialog>
            )}
        </>
    );
};
