import React, { useMemo, useState } from "react";
import { Item } from '@react-stately/collections';
import { Table } from "@tanstack/react-table";
import { FiCheck, FiRotateCcw } from "react-icons/fi";
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import clsx from 'clsx';

import { Modal, ModalBody, ModalFooter, ModalTitle } from "./Modal";
import { CancelModalButton } from "./Buttons";
import DefaultErrorFallback from "./DefaultErrorFallback";
import { createOnReorderFn, OrderableList } from './shared/draganddrop';
import { DRAG_AND_DROP_CUSTOM_TYPE } from "../utilities/constants";

function getInitialAvailableColumns(available: any, selected: Array<any>) {
    return difference(Object.keys(available), selected).map(columnKey => {
        const column = available[columnKey];

        return {
            id: columnKey,
            label: column.label,
            protected: column.protected || false,
            hidden: column.hidden || false,
            virtual: column.virtual || false
        };
    }).filter(column => {
        return column.virtual === false;
    });
}

function getInitialSelectedColumns(available: any, selected: Array<any>) {
    return selected.filter(columnKey => {
        const column = available[columnKey];

        if (! column) {
            return false;
        }

        return column.virtual !== true;
    }).map(columnKey => {
        const column = available[columnKey];

        return {
            id: columnKey,
            label: column.label,
            protected: column.protected || false,
            hidden: column.hidden || false,
            virtual: column.virtual || false
        };
    });
}

function getHiddenColumnKeys(available: any) {
    return Object.keys(available).reduce((hidden: Array<string>, columnKey: string) => {
        const column = available[columnKey];

        if (column.hidden || column.virtual) {
            hidden.push(columnKey);
        }

        return hidden;
    }, []);
}

function ColumnItem({ item, isDragPreview = false, isDisabled = false }: any) {
    return (
        <span
            className={clsx('option py-2 mb-2 outline-none rounded-sm flex items-center border', {
                'border-gray-400 px-4': !isDragPreview,
                'px-6 w-[300px] font-semibold border-blue-500': isDragPreview,
                'bg-blue-200 cursor-move': !isDisabled,
                'bg-gray-400 cursor-not-allowed': isDisabled
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
    table: Table<any>;
    onClose: () => void;
    updateSelectedColumns: (columns: Array<any>) => void;
    ErrorFallback?: React.ComponentType;
};

export function TableConfigModal({ onClose, name, columnConfig, currentColumns, updateSelectedColumns, table, ErrorFallback = DefaultErrorFallback }: TableConfigModalProps) {
    const availableColumns = useMemo(() => {
        return columnConfig.reduce((config: any, column: any) => {
            const id = column.accessorKey || column.id;

            config[id] = {
                id,
                label: column.header || id,
                ...column.meta
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
        const { value } = JSON.parse(await e.items[0].getText(DRAG_AND_DROP_CUSTOM_TYPE));

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
        const { value } = JSON.parse(await e.items[0].getText(DRAG_AND_DROP_CUSTOM_TYPE));

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
                            acceptedDragTypes={[DRAG_AND_DROP_CUSTOM_TYPE]}
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
                            acceptedDragTypes={[DRAG_AND_DROP_CUSTOM_TYPE]}
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
                            const defaultVisibleColumns = Object.entries(availableColumns).reduce((obj, [key, column]) => {
                                // @ts-ignore
                                if (column.hidden !== true && column.virtual !== true) {
                                    // @ts-ignore
                                    obj.push(key);
                                }

                                return obj;
                            }, []);

                            const hiddenColumns = getHiddenColumnKeys(availableColumns);

                            // FIXME: gestione colonne virtual, al momento ritornano tutte...
                            table.setColumnVisibility(() => {
                                return {
                                    ...Object.keys(defaultVisibleColumns).reduce((obj: any, id) => { 
                                        obj[id] = true; 
                                        return obj;}
                                    , {}),
                                    ...hiddenColumns.reduce((obj: any, id) => { 
                                        obj[id] = false; 
                                        return obj;}
                                    , {})
                                }
                            });

                            const additionalColumns: Array<string> = [];

                            if (Boolean(table.options.enableRowSelection)) {
                                additionalColumns.push('select');
                            }

                            if (table.options.enableExpanding) {
                                additionalColumns.push('expand');
                            }

                            // console.log(defaultVisibleColumns);

                            // @ts-ignore
                            table.setColumnOrder(() => [].concat(...additionalColumns).concat(defaultVisibleColumns));

                            updateSelectedColumns(defaultVisibleColumns);

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
                        const hiddenColumns = getHiddenColumnKeys(availableColumns);

                        table.setColumnVisibility(() => {
                            const update = {
                                ...hiddenColumns.reduce((obj: any, id) => { 
                                    obj[id] = false; 
                                    return obj;}
                                , {}),
                                ...selected.reduce((obj: any, column) => { 
                                    obj[column.id] = true; 
                                    return obj;}
                                , {}),
                                ...available.reduce((obj: any, column) => { 
                                    obj[column.id] = false; 
                                    return obj;}
                                , {})
                            };

                            return update;
                        });

                        const additionalColumns: Array<string> = [];

                        if (Boolean(table.options.enableRowSelection)) {
                            additionalColumns.push('select');
                        }

                        if (table.options.enableExpanding) {
                            additionalColumns.push('expand');
                        }

                        // @ts-ignore
                        table.setColumnOrder(() => [].concat(...additionalColumns).concat(selected.map((column) => column.id)));

                        updateSelectedColumns(uniq([
                            ...selected.map((column: any) => column.id),
                            // ...hiddenColumns
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