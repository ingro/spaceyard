import React, { useRef } from 'react';
import { useSelect } from 'downshift';
// import find from 'lodash/find';
// import pick from 'lodash/pick';
// import uniqueId from 'lodash/uniqueId';
import clsx from 'clsx';

import { Dropdown, DropdownItem, ClearBtn, ToggleBtn } from './shared/dropdown';
import { SelectOption } from '../types';

import '../styles/dropdowns.css';

// import FieldWrapper, { FieldWrapperProps } from './FieldWrapper';

type SelectProps = {
    options: Array<SelectOption>;
    onChange?: (item: any) => void;
    placeholder?: string;
    value?: any;
    showClearBtn?: boolean;
    id?: string;
    dropdownPosition?: 'top' | 'bottom';
    dropdownFixed?: boolean;
};

// interface SelectFieldProps extends SelectProps, FieldWrapperProps {};

const itemToString = (item: any) => item?.label || '';

export function Select({ 
    options, 
    placeholder = 'Seleziona', 
    onChange, 
    value,
    showClearBtn = false, 
    id, 
    dropdownPosition = 'bottom', 
    dropdownFixed = false 
}: SelectProps) {
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    let selectValue = null;

    if (typeof value === 'object') {
        selectValue = value;
    } else if (value !== null) {
        selectValue = options.find((option) => option.value === value);
    }

    const {
        isOpen,
        selectedItem,
        selectItem,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        // openMenu,
        // toggleMenu
    } = useSelect({
        items: options,
        defaultHighlightedIndex: selectValue ? undefined : 0,
        itemToString,
        onSelectedItemChange: (changes) => {
            if (onChange) {
                onChange(changes.selectedItem)
            }
        },
        selectedItem: selectValue,
        id 
    });

    return (
        <div className="relative" ref={containerRef}>
            <div 
                className={clsx('form-select cursor-default flex w-full', {
                    'form-select-open': isOpen
                })} 
                {...getToggleButtonProps()}
            >
                <span 
                    className={clsx('flex-grow select-none text-left truncate', {
                        'text-gray-400': !selectedItem
                    })} 
                    {...getLabelProps()}
                >
                    {itemToString(selectedItem) || placeholder}
                </span>
                {selectedItem && showClearBtn && (
                    <ClearBtn onClick={() => selectItem(null)} />
                )}
                <ToggleBtn isOpen={isOpen} />
            </div>
            <Dropdown 
                {...getMenuProps()} 
                elementRef={containerRef} 
                dropdownRef={dropdownRef} 
                isOpen={isOpen}
                position={dropdownPosition}
                fixed={dropdownFixed}
            >
                {isOpen &&
                    options.map((item: any, index: number) => {
                        return (
                            <DropdownItem
                                isSelected={item === selectedItem}
                                isHighlighted={highlightedIndex === index}
                                key={`${item}${index}`}
                                {...getItemProps({item, index})}
                            >
                                <span
                                    className="flex highlighted-text cursor-default"
                                >
                                    {itemToString(item)}
                                </span>
                            </DropdownItem>
                        );
                    }
                )}
            </Dropdown>
            <div tabIndex={0} />
        </div>
    );
}
