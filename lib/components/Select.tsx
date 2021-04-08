import React, { SyntheticEvent, useRef, useState } from 'react';
import { useSelect } from 'downshift';
// import find from 'lodash/find';
import { Control, useController } from 'react-hook-form';
import uniqueId from 'lodash/uniqueId';
import pick from 'lodash/pick';
import clsx from 'clsx';

import { Dropdown, DropdownItem, ClearBtn, ToggleBtn } from './shared/dropdown';
import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';
import { SelectOption } from '../types';

import '../styles/dropdowns.css';

type SelectProps = {
    name?: string;
    options: Array<SelectOption>;
    onChange?: (item: any) => void;
    placeholder?: string;
    value?: any;
    showClearBtn?: boolean;
    id?: string;
    dropdownPosition?: 'top' | 'bottom';
    dropdownFixed?: boolean;
};

const itemToString = (item: any) => item?.label || '';

export function Select({ 
    name,
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
        // getLabelProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        openMenu
        // toggleMenu
    } = useSelect({
        items: options,
        initialHighlightedIndex: selectValue ? undefined : 0,
        itemToString,
        onSelectedItemChange: (changes) => {
            if (onChange) {
                onChange(changes.selectedItem)
            }
        },
        selectedItem: selectValue,
        id 
    });

    const toggleProps = getToggleButtonProps();

    return (
        <div className="relative" ref={containerRef}>
            <div 
                tabIndex={0}
                className={clsx('form-select cursor-default flex w-full group', {
                    'form-select-open': isOpen,
                    'form-element-has-value': selectValue
                })} 
                {...toggleProps}
                onKeyPress={e => {
                    if (e.key === 'Enter' && isOpen === false) {
                        openMenu();
                        e.stopPropagation()
                    }
                }}
            >
                <span 
                    className={clsx('flex-grow select-none text-left truncate', {
                        'text-gray-400': !selectedItem
                    })} 
                    // {...getLabelProps()}
                >
                    {itemToString(selectedItem) || placeholder}
                </span>
                {selectedItem && showClearBtn && (
                    <ClearBtn 
                        onClick={(e: SyntheticEvent) => {
                            e.stopPropagation();
                            selectItem(null)
                        }} 
                    />
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
        </div>
    );
}

interface SelectFieldProps extends SelectProps, FieldWrapperProps {};

export const SelectField = React.forwardRef<any, SelectFieldProps>((props: any, forwardRef) => {
    const inputId = uniqueId(`form-${props.name}_`);

    const inputPropsName = ['options', 'placeholder', 'value', 'showClearBtn', 'onChange', 'dropdownFixed'];

    // @ts-ignore
    const inputProps: SelectProps = pick(props, inputPropsName);

    return (
        <FieldWrapper {...props} inputId={inputId}>
            <Select
                {...inputProps}
                id={inputId}
                // ref={forwardRef} 
            />
        </FieldWrapper>
    );
});

interface SelectFieldControllerProps extends SelectFieldProps {
    name: string;
    control: Control;
    defaultValue?: any;
    valueSelector?: (option: any) => string | number | null;
};

export function SelectFieldController({ name, control, defaultValue, valueSelector = option => option, ...rest}: SelectFieldControllerProps) {
    const { field, fieldState } = useController({
        name,
        control,
        defaultValue
    });

    return (
        <SelectField 
            {...field}
            {...rest}
            error={fieldState.error}
            onChange={(option) => field.onChange(valueSelector(option))}
        />
    );
}
