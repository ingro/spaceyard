import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";

import { useDisclosure } from "./useDisclosure";

type useEditDrawerResult = {
    isOpenEditSide: boolean;
    openEditSide: (id: any) => void;
    closeEditSide: () => void;
    currentItemEditId: string | number | null;
};

export function useEditDrawer(): useEditDrawerResult {
    const [currentItemEditId, setCurrentItemEditId] = useState(null);
    const { isOpen, close, open } = useDisclosure(false);

    const history = useHistory();

    useEffect(() => {
        const { location } = history;

        // @ts-ignore
        if (location.state?.currentItemEditId) {
            // @ts-ignore
            setCurrentItemEditId(location.state.currentItemEditId);
            open();
        }
    // eslint-disable-next-line
    }, []);

    const openEditSide = useCallback((id) => {
        setCurrentItemEditId(id);

        const { location } = history;

        history.replace(`${location.pathname}${location.search}`, {
            currentItemEditId: id
        });

        open();
    // eslint-disable-next-line
    }, []);

    const closeEditSide = useCallback(() => {
        const { location } = history;

        history.replace(`${location.pathname}${location.search}`, {});
        close();
    // eslint-disable-next-line
    }, [location.pathname, location.search]);

    return {
        isOpenEditSide: isOpen,
        openEditSide,
        closeEditSide,
        currentItemEditId
    };
}
