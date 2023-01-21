import React, { useMemo, useState } from "react";
import { Item } from '@react-stately/collections';
import { FiCheck, FiRotateCcw } from "react-icons/fi";
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import clsx from 'clsx';

import { Modal, ModalBody, ModalFooter, ModalTitle } from "./Modal";
import { CancelModalButton } from "./Buttons";
import { createOnReorderFn, OrderableList } from './shared/draganddrop';
import DefaultErrorFallback from "./DefaultErrorFallback";

function getInitialAvailableColumns(available: any, selected: Array<any>) {
    return difference(Object.keys(available), selected).map(columnKey => {
        const column = available[columnKey];

        return {
            id: columnKey,
            label: column.label,
            protected: column.protected || false,
            hidden: column.hidden || false
        };
    }).filter(column => {
        return ! column.hidden;
    });
}

function getInitialSelectedColumns(available: any, selected: Array<any>) {
    return selected.filter(columnKey => {
        const column = available[columnKey];

        if (! column) {
            return false;
        }

        return !column.hidden;
    }).map(columnKey => {
        const column = available[columnKey];

        return {
            id: columnKey,
            label: column.label,
            protected: column.protected || false,
            hidden: column.hidden || false
        };
    });
}

function getHiddenColumnKeys(available: any) {
    return Object.keys(available).reduce((hidden: Array<string>, columnKey: string) => {
        const column = available[columnKey];

        if (column.hidden) {
            hidden.push(columnKey);
        }

        return hidden;
    }, []);
}

function ColumnItem({ item, isDragPreview }: any) {
    return (
        <span
            className={clsx('option py-2 mb-2 outline-none rounded-sm flex items-center border bg-blue-200', {
                'border-gray-400 px-4': !isDragPreview,
                'px-12 font-semibold border-blue-500': isDragPreview,
            })}
        >
            <span>
                {item.label}
            </span>
        </span>
    );
}

type TableConfigModalProps = {
    columnConfig: any;
    currentColumns: Array<any>;
    name: string;
    onClose: () => void;
    updateSelectedColumns: (columns: Array<any>) => void;
    ErrorFallback?: React.ComponentType;
};

export function TableConfigModal({ onClose, name, columnConfig, currentColumns, updateSelectedColumns, ErrorFallback = DefaultErrorFallback }: TableConfigModalProps) {
    const availableColumns = useMemo(() => {
        return columnConfig.reduce((config: any, column: any) => {
            const id = column.id || column.accessor;

            config[id] = {
                id,
                label: column.Header || id,
                ...column.columnConfig
            };

            return config;
        }, {});
    }, [columnConfig]);

    const stateAvailable = useState(getInitialAvailableColumns(availableColumns, currentColumns));
    const stateSelected = useState(getInitialSelectedColumns(availableColumns, currentColumns));

    const [available, setAvailable] = stateAvailable;
    const [selected, setSelected] = stateSelected;

    const onReorderAvailable = useMemo(() => {
        return createOnReorderFn(available, setAvailable, 'id');
    }, [available, setAvailable]);

    const onReorderSelected  = useMemo(() => {
        return createOnReorderFn(selected, setSelected, 'id');
    }, [selected, setSelected]);

    const onInsert = async (e: any) => {
        const { value } = JSON.parse(await e.items[0].getText('my-app-custom-type'));

        const item = { ...value };

        let destState = null;
        let sourceState = null;

        let targetIndex = findIndex(available, { id: e.target.key });

        if (targetIndex === -1) {
            sourceState = stateAvailable;
            destState = stateSelected;
            targetIndex = findIndex(selected, { id: e.target.key });
        } else {
            sourceState = stateSelected;
            destState = stateAvailable;
        }

        let newItemIndex = (e.target.dropPosition === 'before') ? targetIndex : targetIndex + 1;

        if (newItemIndex < 0) {
            newItemIndex = 0;
        }

        const [sourceArray, setSourceArray] = sourceState;
        const [destArray, setDestArray] = destState;
        
        destArray.splice(newItemIndex, 0, item);

        setDestArray([...destArray]);

        const sourceIndex = findIndex(sourceArray, { id: item.id });

        if (sourceIndex >= 0) {
            sourceArray.splice(sourceIndex, 1);

            setSourceArray([...sourceArray]);
        }
    };

    const onRootDrop = async (e: any) => {
        const { value } = JSON.parse(await e.items[0].getText('my-app-custom-type'));

        const item = { ...value };

        let destState = null;
        let sourceState = null;

        let sourceIndex = findIndex(available, { id: item.id });

        if (sourceIndex === -1) {
            sourceState = stateSelected;
            destState = stateAvailable;
            sourceIndex = findIndex(selected, { id: item.id });
        } else {
            sourceState = stateAvailable;
            destState = stateSelected;
        }

        const [sourceArray, setSourceArray] = sourceState;
        const [destArray, setDestArray] = destState;
        
        destArray.splice(0, 0, item);

        setDestArray([...destArray]);

        if (sourceIndex >= 0) {
            sourceArray.splice(sourceIndex, 1);

            setSourceArray([...sourceArray]);
        }
    };
    
    return (
        <Modal
            labelId="table-config"
            onClose={onClose}
            dismissable={false}
            ErrorFallback={ErrorFallback}
        >
            <ModalTitle 
                onClose={onClose}
                labelId="table-config"
            >
                Configurazione Tabella "{name}"
            </ModalTitle>
            <ModalBody>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 h-full" style={{ minHeight: '50vh' }}>
                    <div className="flex flex-col">
                        <span className="text-lg">Colonne disponibili</span>
                        <OrderableList
                            selectionMode="single"
                            items={available}
                            itemKeyName="id"
                            listClassName="bg-gray-200 px-2 pt-2 grow"
                            acceptedDragTypes={['my-app-custom-type']}
                            onReorder={onReorderAvailable}
                            onInsert={onInsert}
                            onRootDrop={onRootDrop}
                            ItemComponent={ColumnItem}
                        >
                            {(item: any) => <Item key={item.id}>{item.label}</Item>}
                        </OrderableList>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg">Colonne selezionate</span>
                        <OrderableList
                            selectionMode="single"
                            items={selected}
                            itemKeyName="id"
                            listClassName="bg-gray-200 px-2 pt-2 grow"
                            acceptedDragTypes={['my-app-custom-type']}
                            onReorder={onReorderSelected}
                            onInsert={onInsert}
                            onRootDrop={onRootDrop}
                            ItemComponent={ColumnItem}
                        >
                            {(item: any) => <Item key={item.id}>{item.label}</Item>}
                        </OrderableList>
                    </div>
                </div>
                <div className="mt-2">
                    <button 
                        className="btn btn-link"
                        onClick={() => {
                            updateSelectedColumns(Object.keys(availableColumns));
                            onClose();
                        }}
                    >
                        <FiRotateCcw /> Ripristina default
                    </button>
                </div>
            </ModalBody>
            <ModalFooter>
                <CancelModalButton onClose={onClose} />
                <button 
                    className="btn btn-lg btn-info ml-1"
                    onClick={() => {
                        updateSelectedColumns(uniq([
                            ...selected.map((column: any) => column.id),
                            ...getHiddenColumnKeys(availableColumns)
                        ]));
                        onClose();
                    }}
                >
                    <FiCheck /> Conferma
                </button>
            </ModalFooter>
        </Modal>
    );
}