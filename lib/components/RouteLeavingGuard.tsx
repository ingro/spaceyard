import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

import { useAppContext } from '../hooks/useAppContext';
import { ConfirmDialog } from './ConfirmDialog';
// import { useDisclosure } from '../hooks/useDisclosure';

type RouteLeavingGuardProps = {
    disableBlockNavigation?: (nextLocation: Location) => boolean;
    when?: boolean | undefined;
    resetIfBlockingConditionDisappears?: boolean;
    title?: string;
    text: string;
};

export function RouteLeavingGuard({
    when = false,
    title = 'Attenzione',
    text,
    disableBlockNavigation = () => false,
    resetIfBlockingConditionDisappears = true
}: RouteLeavingGuardProps) {
    // const { isOpen, open, close } = useDisclosure(false);
    // const [lastLocation, setLastLocation] = useState<Location | null>(null);
    // const [confirmedNavigation, setConfirmedNavigation] = useState(false);
    const { appRoutes } = useAppContext();

    function shouldBlock({ currentLocation, nextLocation, historyAction }: any): boolean {
        if (nextLocation && nextLocation.pathname === appRoutes.logout) {
            return false;
        }

        if (disableBlockNavigation(currentLocation)) {
            return false;
        }

        return when;
    }

    // @ts-ignore
    const blocker = useBlocker(shouldBlock);

    // reset the blocker if the blocking condition disappears
    useEffect(() => {
        if (blocker.state === "blocked" && !when && resetIfBlockingConditionDisappears) {
            blocker.reset();
        }
    }, [blocker, when, resetIfBlockingConditionDisappears]);

    // const navigate = useNavigate();

    // const handleBlockedNavigation = (nextLocation: any) => {
    //     // Bypasso la verifica se ho gia deciso di effettuare il logout dall'applicazione
    //     if (nextLocation && nextLocation.pathname === appRoutes.logout) {
    //         setConfirmedNavigation(true);
    //     }

    //     if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
    //         open();
    //         setLastLocation(nextLocation);

    //         return false;
    //     }

    //     return true;
    // };

    const handleConfirmNavigationClick = () => {
        blocker.proceed?.();
        close();
        // setConfirmedNavigation(true);
    }; 

    // useEffect(() => {
    //     if (confirmedNavigation && lastLocation) {
    //         // Navigate to the previous blocked location with your navigate function
    //         // navigate(lastLocation.pathname);
    //         navigate(lastLocation);
    //     }
    //     // eslint-disable-next-line
    // }, [confirmedNavigation, lastLocation]);

    return (
        <>
            {blocker.state === 'blocked' && (
                <ConfirmDialog 
                    title={title}
                    onCancel={() => {
                        blocker.reset?.();
                        close();
                    }}
                    onConfirm={handleConfirmNavigationClick}
                >
                    {text}
                </ConfirmDialog>
            )}
        </>
    );
};
