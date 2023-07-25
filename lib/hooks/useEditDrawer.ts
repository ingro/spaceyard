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

        navigate(`${window.location.pathname}${window.location.search}`, {
            replace: true,
            state: {
                currentItemEditId: id
            }
        });

        open();
    }, []);

    const closeEditSide = useCallback(() => {
        setTimeout(() => {
            navigate(`${window.location.pathname}${window.location.search}`, { replace: true });
            close();
        }, 0);
    }, []);

    return {
        isOpenEditSide: isOpen,
        openEditSide,
        closeEditSide,
        currentItemEditId
    };
}
