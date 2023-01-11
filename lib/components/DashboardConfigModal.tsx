import { useState, useRef } from 'react';
import { FiCheck } from 'react-icons/fi';
import { useListState } from '@react-stately/list';
import { Item } from '@react-stately/collections';
import { useDroppableCollectionState, useDraggableCollectionState } from '@react-stately/dnd';
import { useListBox, useOption } from '@react-aria/listbox';
import { useDroppableCollection, ListDropTargetDelegate, useDraggableCollection, useDraggableItem, useDropIndicator, useDroppableItem, DragPreview } from '@react-aria/dnd';
import { ListKeyboardDelegate } from '@react-aria/selection';
import { mergeProps } from '@react-aria/utils';
import difference from 'lodash/difference';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import clsx from 'clsx';

import { CancelModalButton } from './Buttons';
import DefaultErrorFallback from './DefaultErrorFallback';
import { Modal, ModalBody, ModalFooter, ModalTitle } from './Modal';
import { Checkbox } from './Checkbox';
import { Select } from './Select';
import { DashboardWidgetConfig, DashboardWidgetConfigStatic, DashboardWidgedSizes } from '../types';

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

function DropIndicator(props: any) {
    const ref = useRef(null);
    const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
        props,
        props.dropState,
        ref
    );

    // console.log(isHidden, isDropTarget, dropIndicatorProps);

    if (isHidden) {
        return null;
    }
  
    return (
        <li
            {...dropIndicatorProps}
            role="option"
            ref={ref}
            className={clsx('drop-indicator absolute w-full outline-none mt-[-1.25rem]', { // mb-[-0.25rem] mt-[-0.25rem]
                // 'bg-transparent': !isDropTarget,
                // 'bg-blue-500 drop-target': isDropTarget
            })}
        >
            <span className="border-2 border-blue-500 absolute grow-0 rounded-full h-4 w-4 bg-white top-2 left-[-1rem]" />
            <span className="border-t border-2 border-blue-500 w-full inline-block grow" />
            <span className="border-2 border-blue-500 absolute grow-0 rounded-full h-4 w-4 bg-white top-2 right-[-1rem]" />
        </li>
    );
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

function ReorderableWidget({ item, state, dragState, dropState, updateWidgetActive, updateWidgetSize }: any) {
    const ref = useRef(null);

    const { optionProps, isSelected, isDisabled } = useOption(
        { key: item.code },
        state,
        ref
    );

    const { dropProps, isDropTarget } = useDroppableItem(
        {
            target: { type: 'item', key: item.code, dropPosition: 'on' }
        },
        dropState,
        ref
    );

    // const { isFocusVisible, focusProps } = useFocusRing();

    const { dragProps } = useDraggableItem({
        key: item.code
    }, dragState);

    return (
        <>
            <DropIndicator
                target={{ type: 'item', key: item.code, dropPosition: 'before' }}
                dropState={dropState}
            />
            <li
                {...mergeProps(optionProps, dragProps, dropProps)}
                ref={ref}
                // className={clsx('option px-4 py-2 mb-2 outline-none rounded-sm flex items-center bg-green-200 border border-gray-400', {
                //     // 'focus-visible': isFocusVisible,
                //     'drop-target': isDropTarget
                // })}
            >
                <WidgetItem item={item} updateWidgetActive={updateWidgetActive} updateWidgetSize={updateWidgetSize}/>
            </li>
            {state.collection.getKeyAfter(item.code) == null &&
                (
                    <DropIndicator
                        target={{ type: 'item', key: item.code, dropPosition: 'after' }}
                        dropState={dropState}
                    />
                )
            }
        </>
    );
}

function WidgetList(props: any) {
    const { items } = props;
    const preview = useRef(null);

    const state = useListState(props);
    const ref = useRef(null);

    const { listBoxProps } = useListBox(
        {
            ...props,
            'aria-label': 'Widget List',
            shouldSelectOnPressUp: true
        },
        state,
        ref
    );

    const dropState = useDroppableCollectionState({
        ...props,
        collection: state.collection,
        selectionManager: state.selectionManager
    });

    const { collectionProps } = useDroppableCollection(
        {
            ...props,
            keyboardDelegate: new ListKeyboardDelegate(
                state.collection,
                state.disabledKeys,
                ref
            ),
            dropTargetDelegate: new ListDropTargetDelegate(
                state.collection, 
                ref
            ),
        },
        dropState,
        ref
    );

    const dragState = useDraggableCollectionState({
        ...props,
        collection: state.collection,
        selectionManager: state.selectionManager,
        preview,
        getItems: props.getItems || ((keys) => {
            // console.log(keys);
            return [...keys].map((key) => {
                // console.log(state.collection);
                const item = state.collection.getItem(key);

                // console.log(item);
    
                return {
                    ...item.value,
                    'text/plain': item.textValue
                };
            })
        })
    });

    useDraggableCollection(
        props, 
        dragState, 
        ref
    );

    return (
        <ul
            className='relative mt-1'
            ref={ref}
            {...mergeProps(listBoxProps, collectionProps)} 
        >
            {items.map((item: any) => (
                <ReorderableWidget
                    key={item.code}
                    item={item}
                    state={state}
                    dragState={dragState}
                    dropState={dropState}
                    updateWidgetActive={props.updateWidgetActive}
                    updateWidgetSize={props.updateWidgetSize}
                />
            ))}
            <DragPreview ref={preview}>
                {(items) => {
                    const item = items[0];

                    // console.log(item);

                    return (
                        <WidgetItem item={item} isDragPreview={true} />
                    );
                }}
            </DragPreview>
        </ul>
    )
}

function reorder(list: Array<any>, startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
}

export function DashboardConfigModal({ widgetConfig, widgetsList, updateConfig, onClose, ErrorFallback = DefaultErrorFallback }: any) {
    const [items, setItems] = useState(getInitialState(widgetConfig, widgetsList));

    const onReorder = (e: any) => {
        // console.log(items);
        // console.log(e.target);
        // console.log(Array.from(e.keys));

        const sourceCode = Array.from(e.keys)[0];

        if (sourceCode === e.target.key) {
            return;
        }

        // @ts-ignore
        const sourceIndex = findIndex(items, { code: sourceCode });
        let targetIndex = findIndex(items, { code: e.target.key });

        // if (e.target.dropPosition === 'before' && targetIndex > 0) {
        //     targetIndex = targetIndex - 1;
        // } else if (e.target.dropPosition === 'after') {
        //     // targetIndex = targetIndex + 1;
        // }

        // console.log(sourceIndex);
        // console.log(targetIndex);

        const reordered = reorder(
            items,
            sourceIndex,
            targetIndex
        );
    
        setItems(reordered);
    }

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
                    <WidgetList
                        selectionMode="single"
                        // selectionBehavior="replace"
                        items={items}
                        onReorder={onReorder}
                        updateWidgetActive={updateWidgetActive}
                        updateWidgetSize={updateWidgetSize}
                    >
                        {(item: any) => <Item key={item.code}>{item.name}</Item>}
                    </WidgetList>
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