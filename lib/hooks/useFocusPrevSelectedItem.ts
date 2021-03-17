import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function useFocusPrevSelectedItem(isFetchedAfterMount: boolean) {
    const location = useLocation();

    useEffect(() => {
        // @ts-ignore
        if (location.state && location.state.prevSelectedItemId) {
            // @ts-ignore
            const el = document.getElementsByClassName(`--item-${location.state.prevSelectedItemId}`);

            if (el[0] && isFetchedAfterMount) {
                setTimeout(() => {
                    if (el[0]) {
                        // @ts-ignore
                        el[0].focus();
                    }
                }, 50);
            }
        }
        // eslint-disable-next-line
    }, [isFetchedAfterMount]);
}
