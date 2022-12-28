import { useState, useRef } from 'react';
import { FiCheck } from 'react-icons/fi';
import { useListState } from '@react-stately/list';
import { Item } from '@react-stately/collections';
import { useDroppableCollectionState, useDraggableCollectionState } from '@react-stately/dnd';
import { useListBox, useOption } from '@react-aria/listbox';
import { useDroppableCollection, ListDropTargetDelegate, useDraggableCollection, useDraggableItem, useDropIndicator, useDroppableItem } from '@react-aria/dnd';
import { ListKeyboardDelegate } from '@react-aria/selection';
import { mergeProps } from '@react-aria/utils';
import difference from 'lodash/difference';
import clsx from 'clsx';

import { CancelModalButton } from './Buttons';
import DefaultErrorFallback from './DefaultErrorFallback';
import { Modal, ModalBody, ModalFooter, ModalTitle } from './Modal';
import { DashboardWidgetConfig, DashboardWidgetConfigStatic } from '../types';

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
    const ref = useRef();
    const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
        props,
        props.dropState,
        // @ts-ignore
        ref
    );

    if (isHidden) {
        return null;
    }
  
    return (
        <li
            {...dropIndicatorProps}
            role="option"
            // @ts-ignore
            ref={ref}
            className={`drop-indicator ${isDropTarget ? 'drop-target' : ''}`}
        />
    );
  }

function ReorderableWidget({ item, state, dragState, dropState }: any) {
    const ref = useRef();

    const { optionProps, isSelected, isDisabled } = useOption(
        { key: item.code },
        state,
        // @ts-ignore
        ref
    );

    const { dropProps, isDropTarget } = useDroppableItem(
        {
            target: { type: 'item', key: item.code, dropPosition: 'on' }
        },
        dropState,
        // @ts-ignore
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
                // @ts-ignore
                ref={ref}
                className={clsx('option', {
                    // 'focus-visible': isFocusVisible,
                    'drop-target': isDropTarget
                })}
            >
                {item.name}
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

    const state = useListState(props);
    const ref = useRef();

    const { listBoxProps } = useListBox(
        {
            ...props,
            shouldSelectOnPressUp: true
        },
        state,
        // @ts-ignore
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
                // @ts-ignore
                ref
            ),
            dropTargetDelegate: new ListDropTargetDelegate(
                state.collection, 
                // @ts-ignore
                ref
            )
        },
        dropState,
        // @ts-ignore
        ref
    );

    const dragState = useDraggableCollectionState({
        ...props,
        collection: state.collection,
        selectionManager: state.selectionManager,
        getItems: props.getItems || ((keys) => {
            // console.log(keys);
            return [...keys].map((key) => {
                // console.log(state.collection);
                const item = state.collection.getItem(key);

                console.log(item);
    
                return {
                    'text/plain': item.textValue
                };
            })
        })
    });

    useDraggableCollection(
        props, 
        dragState, 
        // @ts-ignore
        ref
    );

    return (
        <ul
            {...mergeProps(listBoxProps, collectionProps)} 
            // @ts-ignore
            ref={ref}
        >
            {items.map((item: any) => (
                <ReorderableWidget
                    key={item.code}
                    item={item}
                    state={state}
                    dragState={dragState}
                    dropState={dropState}
                />
            ))}
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

    // console.log(items);

    const onReorder = (e: any) => {
        console.log(e.target, e.keys);

        const reordered = reorder(
            items,
            0,
            3
        );
    
        setItems(reordered);

        if (e.target.dropPosition === 'before') {
            
        } else if (e.target.dropPosition === 'after') {
            
        }
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
                        selectionBehavior="replace"
                        items={items}
                        onReorder={onReorder}
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