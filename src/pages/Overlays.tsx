import React from "react";

import { CancelModalButton } from "../../lib/components/Buttons";
import { ConfirmDialog } from "../../lib/components/ConfirmDialog";
import { Drawer } from "../../lib/components/Drawer";
import { Modal, ModalBody, ModalFooter, ModalTitle } from "../../lib/components/Modal";
import { useDisclosure } from "../../lib/hooks/useDisclosure";

function AppModal({ onClose }: any) {
    return (
        <Modal 
            labelId="foo"
            onClose={onClose} 
            size="small"
        >
            <ModalTitle labelId="foo" onClose={onClose}>Modale</ModalTitle>
            <ModalBody>
                Hello World!
            </ModalBody>
            <ModalFooter>
                <CancelModalButton onClose={onClose} />
            </ModalFooter>
        </Modal>
    );
}

export default function Overlays() {
    const { toggle: toggleDrawer, isOpen: isOpenDrawer } = useDisclosure();
    const { toggle: toggleModal, isOpen: isOpenModal } = useDisclosure();
    const { toggle: toggleConfirm, isOpen: isOpenConfirm } = useDisclosure();

    return (
        <div>
            <Drawer
                isOpen={isOpenDrawer}
                showOverlay={false}
                onClose={toggleDrawer}
                onOpened={() => console.warn('OPENED!')}
                dismissable={true}
            >
                <h1>I'm a Drawer!</h1>
            </Drawer>
            {isOpenModal && <AppModal onClose={toggleModal} />}
            {isOpenConfirm && <ConfirmDialog onCancel={toggleConfirm} title="Test" onConfirm={() => alert('action confirmed!')}>Are you sure?</ConfirmDialog>}
            <div className="flex flex-col space-y-1 mt-4 w-64">
                <button className="btn" onClick={toggleConfirm}>Show Confirm Dialog</button>
                <button className="btn" onClick={toggleModal}>Open Modal</button>
                <button className="btn" onClick={toggleDrawer}>Toggle Drawer</button>
            </div>
        </div>
    );
}