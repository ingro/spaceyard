import React from 'react';
import { FiCheck } from 'react-icons/fi';

import { Modal, ModalTitle, ModalBody, ModalFooter } from './Modal';
import { CancelModalButton } from './Buttons';

type ConfirmDialogProps = {
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
    children: any;
    Icon?: React.ElementType;
};

export function ConfirmDialog({ title, onCancel, onConfirm, children, Icon = FiCheck }: ConfirmDialogProps) {
    return (
        <Modal labelId="confirm" onClose={onCancel} size="small" dismissable={false}>
            <ModalTitle labelId="confirm" showCloseButton={false} onClose={onCancel}>{title}</ModalTitle>
            <ModalBody>
                {children}
            </ModalBody>
            <ModalFooter>
                <CancelModalButton onClose={onCancel} label="Annulla" />
                <button onClick={onConfirm} className="btn btn-lg btn-primary ml-2 --modal-dialog-confirm-btn">
                    {Icon && (
                        <><Icon />{' '}</>
                    )}
                    Conferma
                </button>
            </ModalFooter>
        </Modal>
    );
}
