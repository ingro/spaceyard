import React, { useState, useMemo } from 'react';
import { FiCheck } from 'react-icons/fi';
import { Item } from '@react-stately/collections';
import difference from 'lodash/difference';
import find from 'lodash/find';
import clsx from 'clsx';

import { CancelModalButton } from './Buttons';
import DefaultErrorFallback from './DefaultErrorFallback';
import { Modal, ModalBody, ModalFooter, ModalTitle } from './Modal';
import { Checkbox } from './Checkbox';
import { Select } from './Select';
import { DashboardWidgetConfig, DashboardWidgetConfigStatic, DashboardWidgedSizes } from '../types';
import { createOnReorderFn, OrderableList } from './shared/draganddrop';

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

function WidgetItem({ item, isDragPreview = false, updateWidgetActive = () => {}, updateWidgetSize = () => {} }: any) {
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
            {isDragPreview === false && (
                <>
                    <Checkbox 
                        checked={item.active}
                        label="Attivo"
                        onChange={(checked: boolean) => {
                            updateWidgetActive(item.code, checked);
                        }}
                    />
                    <span className="ml-2 w-32">
                        <Select
                            options={getSizeOptions()}
                            onChange={(option: any) => {
                                updateWidgetSize(item.code, option ? option.value : null)
                            }}
                            value={item.size}
                        />
                    </span>
                </>    
            )}
        </span>
    );
}

export function DashboardConfigModal({ widgetConfig, widgetsList, updateConfig, onClose, ErrorFallback = DefaultErrorFallback }: any) {
    const [items, setItems] = useState(getInitialState(widgetConfig, widgetsList));

    const onReorder = useMemo(() => {
        return createOnReorderFn(items, setItems, 'code');
    }, [items, setItems]);

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
                    <OrderableList
                        selectionMode="single"
                        items={items}
                        itemKeyName="code"
                        listClassName='bg-slate-200 px-2 pt-2 pb-1'
                        onReorder={onReorder}
                        updateWidgetActive={updateWidgetActive}
                        updateWidgetSize={updateWidgetSize}
                        ItemComponent={WidgetItem}
                    >
                        {(item: any) => <Item key={item.code}>{item.name}</Item>}
                    </OrderableList>
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