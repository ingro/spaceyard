import React, { useCallback, useMemo, useState } from "react";
import { Item } from '@react-stately/collections';
import { FiCheck, FiRotateCcw } from "react-icons/fi";
import findIndex from 'lodash/findIndex';
import difference from 'lodash/difference';
import clsx from 'clsx';

import { Modal, ModalBody, ModalFooter, ModalTitle } from "./Modal";
import { CancelModalButton } from "./Buttons";
import DefaultErrorFallback from "./DefaultErrorFallback";
import { reorder, WidgetList } from "./DashboardConfigModal";

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

function WidgetItem({ item, isDragPreview }: any) {
    return (
        <span
            className={clsx('option py-2 mb-2 outline-none rounded-sm flex items-center border', {
                'bg-green-200': item.active,
                'bg-blue-200': !item.active,
                'border-gray-400 px-4': !isDragPreview,
                'border-blue-500 px-12 font-semibold': isDragPreview
                // 'focus-visible': isFocusVisible,
                // 'drop-target': isDropTarget
            })}
        >
            <span className="grow">
                {item.name}
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

    const [available, setAvailable] = useState(getInitialAvailableColumns(availableColumns, currentColumns));
    const [selected, setSelected] = useState(getInitialSelectedColumns(availableColumns, currentColumns));

    const onReorderAvailable = (e: any) => {
        // console.log(items);
        // console.log(e.target);
        // console.log(Array.from(e.keys));

        const sourceCode = Array.from(e.keys)[0];

        if (sourceCode === e.target.key) {
            return;
        }

        // @ts-ignore
        const sourceIndex = findIndex(available, { code: sourceCode });
        // @ts-ignore
        let targetIndex = findIndex(available, { code: e.target.key });

        // if (e.target.dropPosition === 'before' && targetIndex > 0) {
        //     targetIndex = targetIndex - 1;
        // } else if (e.target.dropPosition === 'after') {
        //     // targetIndex = targetIndex + 1;
        // }

        // console.log(sourceIndex);
        // console.log(targetIndex);

        const reordered = reorder(
            available,
            sourceIndex,
            targetIndex
        );
    
        setAvailable(reordered);
    }

    const onReorderSelected = (e: any) => {
        // console.log(items);
        // console.log(e.target);
        // console.log(Array.from(e.keys));

        const sourceCode = Array.from(e.keys)[0];

        if (sourceCode === e.target.key) {
            return;
        }

        // @ts-ignore
        const sourceIndex = findIndex(selected, { code: sourceCode });
        // @ts-ignore
        let targetIndex = findIndex(selected, { code: e.target.key });

        // if (e.target.dropPosition === 'before' && targetIndex > 0) {
        //     targetIndex = targetIndex - 1;
        // } else if (e.target.dropPosition === 'after') {
        //     // targetIndex = targetIndex + 1;
        // }

        // console.log(sourceIndex);
        // console.log(targetIndex);

        const reordered = reorder(
            selected,
            sourceIndex,
            targetIndex
        );
    
        setSelected(reordered);
    }
    
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
                <div className="grid grid-cols-2 gap-4" style={{ minHeight: '50vh' }}>
                    <WidgetList
                        selectionMode="single"
                        items={available}
                        onReorder={onReorderAvailable}
                        updateWidgetActive={() => {}}
                        updateWidgetSize={() => {}}
                        WidgetItemComponent={WidgetItem}
                    >
                        {(item: any) => <Item key={item.id}>{item.label}</Item>}
                    </WidgetList>
                    <WidgetList
                        selectionMode="single"
                        items={selected}
                        onReorder={onReorderSelected}
                        updateWidgetActive={() => {}}
                        updateWidgetSize={() => {}}
                        WidgetItemComponent={WidgetItem}
                    >
                        {(item: any) => <Item key={item.id}>{item.label}</Item>}
                    </WidgetList>
                </div>
                <div className="mt-2">
                    <button 
                        className="btn btn-link"
                        onClick={() => {
                            // updateSelectedColumns(Object.keys(availableColumns));
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
                        // updateSelectedColumns(uniq([
                        //     ...selected.map((column: any) => column.id),
                        //     ...getHiddenColumnKeys(availableColumns)
                        // ]));
                        // onClose();
                    }}
                >
                    <FiCheck /> Conferma
                </button>
            </ModalFooter>
        </Modal>
    );
}