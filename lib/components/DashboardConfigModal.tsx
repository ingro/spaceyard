import { useState, useRef, useMemo } from 'react';
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
            style={{
                width: 'calc(100% - 1.5rem)'
            }}
            className={clsx('drop-indicator absolute outline-none mt-[-1.25rem]', { // mb-[-0.25rem] mt-[-0.25rem]
                // 'bg-transparent': !isDropTarget,
                // 'bg-blue-500 drop-target': isDropTarget
            })}
        >
            <span className="border-2 border-blue-500 absolute grow-0 rounded-full h-4 w-4 bg-white top-2 left-[-1rem]" />
            <span className="border-t border-2 border-blue-500 w-full inline-block grow" />
            <span className="border-2 border-blue-500 absolute grow-0 rounded-full h-4 w-4 bg-white top-2" />
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

function ReorderableItem({ item, itemKeyName, state, dragState, dropState, ItemComponent, ...rest }: any) {
    const ref = useRef(null);

    const { optionProps, isSelected, isDisabled } = useOption(
        { key: item[itemKeyName] },
        state,
        ref
    );

    const { dropProps, isDropTarget } = useDroppableItem(
        {
            target: { type: 'item', key: item[itemKeyName], dropPosition: 'on' }
        },
        dropState,
        ref
    );

    // const { isFocusVisible, focusProps } = useFocusRing();

    const { dragProps } = useDraggableItem({
        key: item[itemKeyName]
    }, dragState);

    return (
        <>
            <DropIndicator
                target={{ type: 'item', key: item[itemKeyName], dropPosition: 'before' }}
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
                <ItemComponent 
                    item={item} 
                    {...rest}
                    // updateWidgetActive={updateWidgetActive} 
                    // updateWidgetSize={updateWidgetSize}
                />
            </li>
            {state.collection.getKeyAfter(item[itemKeyName]) == null &&
                (
                    <DropIndicator
                        target={{ type: 'item', key: item[itemKeyName], dropPosition: 'after' }}
                        dropState={dropState}
                    />
                )
            }
        </>
    );
}

type OrderableListProps = {
    acceptedDragTypes?: Array<string>;
    children: any;
    getItems?: any;
    ItemComponent: any;
    itemKeyName: string;
    items: Array<any>;
    listClassName?: string;
    onInsert?: (e: any) => void;
    onReorder: (e: any) => void;
    onRootDrop?: (e: any) => void;
    selectionMode?: "single";
    [x: string | number | symbol]: unknown;
}

export function OrderableList(props: OrderableListProps) {
    const { items, itemKeyName, ItemComponent, getItems } = props;
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
        getItems: getItems || ((keys) => {
            // console.log(keys);
            return [...keys].map((key) => {
                // console.log(state.collection);
                const item = state.collection.getItem(key);

                // console.log(item);
    
                return {
                    // ...item.value,
                    'text/plain': item.textValue,
                    'my-app-custom-type': JSON.stringify(item)
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
            className={clsx('relative', props.listClassName)}
            ref={ref}
            {...mergeProps(listBoxProps, collectionProps)} 
        >
            <DropIndicator target={{ type: 'root' }} dropState={dropState} />
            {items.map((item: any) => (
                <ReorderableItem
                    {...props}
                    key={item[itemKeyName]}
                    item={item}
                    state={state}
                    dragState={dragState}
                    dropState={dropState}
                    ItemComponent={ItemComponent}
                />
            ))}
            <DragPreview ref={preview}>
                {(items) => {
                    const item = items[0];

                    const parsed = JSON.parse(item['my-app-custom-type']);

                    return (
                        <ItemComponent item={parsed.value} isDragPreview={true} />
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

export function createOnReorderFn(listArray: Array<any>, setListArray: any, key: string) {
    return function onReorder(e: any) {
        const sourceCode = Array.from(e.keys)[0];

        if (sourceCode === e.target.key) {
            return;
        }

        // @ts-ignore
        const sourceIndex = findIndex(listArray, { [key]: sourceCode });
        // @ts-ignore
        const targetIndex = findIndex(listArray, { [key]: e.target.key });

        const reordered = reorder(
            listArray,
            sourceIndex,
            targetIndex
        );
    
        setListArray(reordered);
    }
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
                        listClassName='bg-slate-200 px-3 pt-3 pb-1'
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