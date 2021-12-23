import React, { useCallback, useState } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import difference from 'lodash/difference';
import { FiCheck, FiRotateCcw } from "react-icons/fi";
import uniq from 'lodash/uniq';

import { Modal, ModalBody, ModalFooter, ModalTitle } from "./Modal";
import { CancelModalButton } from "./Buttons";
import DefaultErrorFallback from "./DefaultErrorFallback";

function reorder(list: Array<any>, startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
}

function move(source: any, destination: any, droppableSource: any, droppableDestination: any): { available: any, selected: any } {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {
        [droppableSource.droppableId]: sourceClone,
        [droppableDestination.droppableId]: destClone
    };

    // @ts-ignore
    return result;
}

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

type TableConfigModalProps = {
    availableColumns: any;
    currentColumns: Array<any>;
    name: string;
    onClose: () => void;
    updateSelectedColumns: (columns: Array<any>) => void;
    ErrorFallback: React.ComponentType;
};

export function TableConfigModal({ onClose, name, availableColumns, currentColumns, updateSelectedColumns, ErrorFallback = DefaultErrorFallback }: TableConfigModalProps) {
    const [available, setAvailable] = useState(getInitialAvailableColumns(availableColumns, currentColumns));
    const [selected, setSelected] = useState(getInitialSelectedColumns(availableColumns, currentColumns));

    // console.log(getHiddenColumnKeys(availableColumns));

    const onDragEnd = useCallback((result: any) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }
    
        if (source.droppableId === destination.droppableId) {
            const reordered = reorder(
                source.droppableId === 'available' ? available : selected,
                source.index,
                destination.index
            );

            const setStateFn = source.droppableId === 'available' ? setAvailable : setSelected;

            setStateFn(reordered);
        } else {
            const moveResult = move(
                source.droppableId === 'available' ? available : selected,
                destination.droppableId === 'available' ? available : selected,
                source,
                destination
            );

            setAvailable(moveResult.available);
            setSelected(moveResult.selected);
        }
    
    }, [available, selected]);

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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex flex-col">
                            <span className="text-lg">Colonne disponibili</span>
                            <Droppable droppableId="available">
                                {(provided: any, snapshot: any) => (
                                    <div
                                        className={clsx('px-1 pt-2 pb-1 grow', {
                                            'bg-gray-300': snapshot.isDraggingOver,
                                            'bg-gray-200': ! snapshot.isDraggingOver
                                        })}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {available.map((column: any, index: number) => (
                                            <Draggable 
                                                key={column.id}
                                                draggableId={column.id}
                                                index={index}
                                            >
                                                {(provided: any, snapshot: any) => (
                                                    <div
                                                        className={clsx('px-4 py-2 mb-2 outline-none rounded-sm flex items-center', {
                                                            'bg-blue-200': ! snapshot.isDragging,
                                                            'bg-blue-400': snapshot.isDragging
                                                        })}
                                                        ref={provided.innerRef}
                                                        style={provided.draggableProps.style}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <span>
                                                            {column.label}
                                                        </span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg">Colonne selezionate</span>
                            <Droppable droppableId="selected">
                                {(provided: any, snapshot: any) => (
                                    <div
                                        className={clsx('px-1 pt-2 pb-1 grow', {
                                            'bg-gray-300': snapshot.isDraggingOver,
                                            'bg-gray-200': ! snapshot.isDraggingOver
                                        })}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {selected.map((column: any, index: number) => ! column.protected 
                                            ? (
                                                <Draggable 
                                                    key={column.id}
                                                    draggableId={column.id}
                                                    index={index}
                                                >
                                                    {(provided: any, snapshot: any) => (
                                                        <div
                                                            className={clsx('px-4 py-2 mb-2 outline-none rounded-sm flex items-center', {
                                                                'bg-blue-200': ! snapshot.isDragging,
                                                                'bg-blue-400': snapshot.isDragging
                                                            })}
                                                            ref={provided.innerRef}
                                                            style={provided.draggableProps.style}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <span>
                                                                {column.label}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                            : (
                                                <div 
                                                    key={column.id}
                                                    className="px-4 py-2 mb-2 outline-none rounded-sm flex items bg-gray-400"
                                                >
                                                    {column.label}
                                                </div>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </DragDropContext>
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
