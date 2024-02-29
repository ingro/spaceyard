import React, { useRef } from 'react';
import { useListState } from '@react-stately/list';
import { useDroppableCollectionState, useDraggableCollectionState } from '@react-stately/dnd';
import { useListBox, useOption } from '@react-aria/listbox';
import { useDroppableCollection, ListDropTargetDelegate, useDraggableCollection, DragPreview, useDropIndicator, useDroppableItem, useDraggableItem } from '@react-aria/dnd';
import { ListKeyboardDelegate } from '@react-aria/selection';
import { mergeProps } from '@react-aria/utils'
import findIndex from 'lodash/findIndex';
import clsx from 'clsx';

import { DRAG_AND_DROP_CUSTOM_TYPE } from '../../utilities/constants';

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

function DropIndicator(props: any) {
    const ref = useRef(null);
    const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
        props,
        props.dropState,
        ref
    );

    // console.log(isHidden, isDropTarget, dropIndicatorProps);

    if (isHidden || props.target.type === 'root') {
        return null;
    }
  
    return (
        <li
            {...dropIndicatorProps}
            role="option"
            ref={ref}
            // style={{
            //     width: 'calc(100% - 1rem)'
            // }}
            className={clsx('drop-indicator absolute w-full outline-none mt-[-1.25rem]', { // mb-[-0.25rem] mt-[-0.25rem]
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
                    isDisabled={isDisabled}
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

    // console.log(props);

    const state = useListState({ ...props, disabledKeys: props.items.filter((i) => i.protected).map((i) => i.id) });
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
                    'text/plain': item?.textValue,
                    [DRAG_AND_DROP_CUSTOM_TYPE]: JSON.stringify(item)
                };
            })
        })
    });

    useDraggableCollection(
        props, 
        dragState, 
        ref
    );

    const isDropTarget = dropState.isDropTarget({type: 'root'});

    return (
        <ul
            className={clsx(props.listClassName, {
                'border-2 border-blue-500': isDropTarget
            })}
            ref={ref}
            {...mergeProps(listBoxProps, collectionProps)} 
        >
            <span className="relative">
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

                        const parsed = JSON.parse(item[DRAG_AND_DROP_CUSTOM_TYPE]);

                        return (
                            <ItemComponent item={parsed.value} isDragPreview={true} />
                        );
                    }}
                </DragPreview>
            </span>
        </ul>
    )
}