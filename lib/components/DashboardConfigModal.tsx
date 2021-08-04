import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiCheck, FiMenu } from 'react-icons/fi';
import difference from 'lodash/difference';
import find from 'lodash/find';
import clsx from 'clsx';

import { Select } from './Select';
import { Modal, ModalBody, ModalFooter, ModalTitle } from './Modal';
import { CancelModalButton } from './Buttons';
import { Checkbox } from './Checkbox';
import { DashboardWidgetConfig, DashboardWidgetConfigStatic } from '../types';

function DefaultErrorFallback({ error }: any) {
    return (
        <div>
            {error.message}
        </div>
    );
}

const sizes = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'X-Large'
};

function getSizeOptions() {
    return Object.entries(sizes).map(([key, value]) => {
        return {
            value: key,
            label: value
        };
    });
}

function getInitialState(widgetConfig: Array<DashboardWidgetConfig>, widgetsList: Record<string, DashboardWidgetConfigStatic>) {
    // @ts-ignore
    const state: Array<DashboardWidgetConfig> = [].concat(...widgetConfig);

    const selectedCodes = widgetConfig.map((widget: DashboardWidgetConfig) => widget.code);

    const availableCodes = Object.keys(widgetsList);

    difference(availableCodes, selectedCodes).forEach((code: string) => {
        state.push({
            name: widgetsList[code].name,
            code,
            size: 'sm',
            active: false,
            extras: widgetsList[code].extras
        });
    });

    return state;
}

function reorder(list: Array<any>, startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
}

function WidgetElement({ widget, index, updateWidgetActive, updateWidgetSize, isDragging }: any) {
    return (
        <Draggable 
            key={widget.code}
            draggableId={widget.code}
            index={index}
        >
            {(provided: any, snapshot: any) => (
                <div
                    className={clsx('px-4 py-2 mb-2 outline-none rounded-sm flex items-center', {
                        'bg-green-200': widget.active && ! snapshot.isDragging,
                        'bg-blue-200': ! widget.active && ! snapshot.isDragging,
                        'bg-green-400': widget.active && snapshot.isDragging,
                        'bg-blue-400': ! widget.active && snapshot.isDragging
                    })}
                    ref={provided.innerRef}
                    style={provided.draggableProps.style}
                    {...provided.draggableProps}
                >
                    <span 
                        className="px-2 py-1 bg-gray-300 mr-2 outline-none"
                        {...provided.dragHandleProps}
                    >
                        <FiMenu />
                    </span>
                    <span className="flex-grow">
                        {widget.name}
                    </span>
                    <Checkbox 
                        checked={widget.active}
                        label="Attivo"
                        onChange={(checked: boolean) => {
                            updateWidgetActive(widget.code, checked)
                        }}
                    />
                    <span className="ml-2 w-32">
                        {isDragging ? (
                            // Necessario ri-renderizzare il Select in maniera che popper aggiorni la posizione...
                            // @ts-ignore
                            <div className="bg-white py-1.5 px-2 w-full">{sizes[widget.size]}</div>
                        ) : (
                            <Select
                                options={getSizeOptions()}
                                onChange={(item: any) => updateWidgetSize(widget.code, item ? item.value : null)}
                                value={widget.size}
                            />
                        )}
                    </span>
                </div>
            )}
        </Draggable>
    )
}

const WidgetList = React.memo(({ widgets, updateWidgetActive, updateWidgetSize, isDragging }: any) => {
    return widgets.map((widget: DashboardWidgetConfig, index: number) => (
        <WidgetElement 
            widget={widget} 
            index={index} 
            key={widget.code}
            updateWidgetActive={updateWidgetActive}
            updateWidgetSize={updateWidgetSize}
            isDragging={isDragging}
        />
    ));
});

export function DashboardConfigModal({ widgetConfig, widgetsList, updateConfig, onClose, ErrorFallback = DefaultErrorFallback }: any) {
    const [items, setItems] = useState(getInitialState(widgetConfig, widgetsList));

    const onDragEnd = useCallback((result: any) => {
        if (!result.destination) {
            return;
        }
    
        const reordered = reorder(
            items,
            result.source.index,
            result.destination.index
        );
    
        setItems(reordered);
    }, [items]);

    function updateWidgetSize(code: string, size: DashboardWidgedSizes) {
        const widget = find(items, { code });

        if (widget) {
            widget.size = size;
        }

        // @ts-ignore
        setItems([].concat(...items));
    }

    function updateWidgetActive(code: string, active: boolean) {
        const widget = find(items, { code });

        if (widget) {
            widget.active = active;
        }

        // @ts-ignore
        setItems([].concat(...items));
    }

    return (
        <Modal
            labelId="dashboard-config"
            onClose={onClose}
            dismissable={false}
            ErrorFallback={ErrorFallback}
        >
            <ModalTitle 
                onClose={onClose}
                labelId="dashboard-config"
            >
                Configurazione Dashboard
            </ModalTitle>
            <ModalBody>
                <div style={{ minHeight: '50vh' }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided: any, snapshot: any) => (
                                <div
                                    className={clsx('px-1 pt-2 pb-1', {
                                        'bg-gray-300': snapshot.isDraggingOver,
                                        'bg-gray-200': ! snapshot.isDraggingOver
                                    })}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <WidgetList 
                                        widgets={items} 
                                        updateWidgetActive={updateWidgetActive}
                                        updateWidgetSize={updateWidgetSize}
                                        isDragging={snapshot.isDraggingOver}
                                    />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </ModalBody>
            <ModalFooter>
                <CancelModalButton onClose={onClose} />
                <button 
                    className="btn btn-lg btn-info ml-1"
                    onClick={() => {
                        updateConfig(items.filter((item: any) => item.active));
                        onClose();
                    }}
                >
                    <FiCheck /> Conferma
                </button>
            </ModalFooter>
        </Modal>
    );
}
