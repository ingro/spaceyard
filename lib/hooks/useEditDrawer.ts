import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

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

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // @ts-ignore
        if (location.state?.currentItemEditId) {
            // @ts-ignore
            setCurrentItemEditId(location.state.currentItemEditId);
            open();
        }
    // eslint-disable-next-line
    }, []);

    const openEditSide = useCallback((id: any) => {
        setCurrentItemEditId(id);

        navigate(`${location.pathname}${location.search}`, {
            replace: true,
            state: {
                currentItemEditId: id
            }
        });

        open();
    // eslint-disable-next-line
    }, [location.pathname, location.search]);

    const closeEditSide = useCallback(() => {
        navigate(`${location.pathname}${location.search}`, { replace: true });
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
