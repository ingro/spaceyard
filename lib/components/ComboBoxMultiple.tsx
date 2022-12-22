import React, { useState, useMemo, useRef } from 'react';
import { matchSorter } from 'match-sorter';
import { useCombobox, useMultipleSelection } from 'downshift';
import { FiX } from 'react-icons/fi';
import uniqueId from 'lodash/uniqueId';
import pick from 'lodash/pick';
import clsx from 'clsx';

import { Dropdown, DropdownItem, ToggleBtn } from './shared/dropdown';
import { highlightString } from '../utilities/formatters';
import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';
import { SelectOption } from '../types';
import { Control, useController } from 'react-hook-form';

const defaultItemToStringFn = (item: any) => item?.label;

// function getItemFromValue(options: Array<any>, value: any) {
//     return options.filter((option: any) => String(value) === String(option.value))[0];
// }

class ComboBoxMultipleClass {
    constructor(
        public options: Array<SelectOption>,
        public value?: Array<SelectOption>,
        public onBlur?: () => void,
        public onChange?: Function,
        public initialIsOpen?: boolean,
        public defaultHighlightedIndex?: number,
        public placeholder?: string,
        public itemToString?: Function,
        public filterKeys?: Array<string|Object>,
        public dropdownPosition?: 'top' | 'bottom',
        public dropdownFixed?: boolean
    ) {}
};

interface ComboBoxMultipleProps extends ComboBoxMultipleClass{};

export const ComboBoxMultiple = React.forwardRef<any, ComboBoxMultipleProps>(({ 
    value, 
    onBlur = () => {},
    onChange = () => {},
    // onIsOpenChange, 
    options, 
    initialIsOpen = false, 
    defaultHighlightedIndex = 0,
    placeholder = 'Cerca...',
    itemToString = defaultItemToStringFn,
    filterKeys = ['label'],
    dropdownPosition = 'bottom', 
    dropdownFixed = false
}, forwardRef) => {
    const [inputValue, setInputValue] = useState('');
    const [hasFocus, setHasFocus] = useState(false);

    const [optionsToDisplay, setOptionsToDisplay] = useState(options.filter((option: any) => {
        if (!value || value.length === 0) {
            return true;
        }

        const values = value.map((record: any) => record.value);

        return ! values.includes(option.value);
    }));

    const selectedItems = useMemo(() => {
        return value || [];
        // return value ? getItemFromValue(optionsToDisplay, value) : null;
        // eslint-disable-next-line
    }, [value]);

    function multiStateReducer(state: any, actionAndChanges: any) {
        const {type, changes} = actionAndChanges;

        // console.log(type);
        // console.log(changes);

        let selectedChanged: boolean|string = false;

        switch (type) {
            case useMultipleSelection.stateChangeTypes.FunctionAddSelectedItem:
                selectedChanged = 'add';
                break;
            case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
                selectedChanged = 'remove';
                break;
        }

        if (selectedChanged) {
            let newOptionsToDisplay: Array<any> = options;

            if (selectedChanged === 'remove' && inputValue !== '') {
                newOptionsToDisplay = matchSorter(options, inputValue, { keys: filterKeys });
            }

            setOptionsToDisplay(newOptionsToDisplay.filter((option: any) => {
                // @ts-ignore
                const values = changes.selectedItems.map((record: any) => record.value);

                return ! values.includes(option.value);
            }));
        }

        return changes;
    }

    const {
        getSelectedItemProps,
        getDropdownProps,
        addSelectedItem,
        removeSelectedItem,
        // selectedItems,
    } = useMultipleSelection({ 
        selectedItems,
        // initialSelectedItems: value || [],
        stateReducer: multiStateReducer,
        onSelectedItemsChange: (changes: any) => {
            onChange(changes.selectedItems);
        }
    });

    const localInputRef = useRef(null);
    let [referenceElement, setReferenceElement] = useState();
    // const containerRef = useRef(null);
    // const dropdownRef = useRef(null);

    const inputRef = forwardRef || localInputRef;
    
    // console.log(optionsToDisplay);

    function stateReducer(state: any, actionAndChanges: any) {
        const { type, changes } = actionAndChanges;

        // console.log(type);
        // console.log(changes);
    
        if (type === useCombobox.stateChangeTypes.InputKeyDownEnter && ! changes.selectedItem) {
            return state;
        }

        switch (type) {
            case useCombobox.stateChangeTypes.ItemClick:
            case useCombobox.stateChangeTypes.InputKeyDownEnter:
            case useCombobox.stateChangeTypes.FunctionSelectItem:
            // case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
                // internalSelectedItemRef.current = changes.selectedItem;

                return {
                    ...changes,
                    inputValue: '',
                    isOpen: true
                };
            case useCombobox.stateChangeTypes.InputBlur:
                if (changes.selectedItem) {
                    return {
                        ...changes,
                        inputValue: ''
                    };
                }
                
                return changes;
            default:
                return changes;
        }
    }

    const comboboxOptions: any = {
        selectedItem: null,
        items: optionsToDisplay,
        onInputValueChange: ({ inputValue }: any) => {
            let newOptionsToDisplay: Array<any> = options;

            if (inputValue !== '') {
                newOptionsToDisplay = matchSorter(options, inputValue, { keys: filterKeys });
            }

            setOptionsToDisplay(newOptionsToDisplay.filter((option: any) => {
                // // @ts-ignore
                // return selectedItems.indexOf(option) < 0;
                const values = selectedItems.map((record: any) => record.value);

                return ! values.includes(option.value);
            }));
        },
        inputValue,
        initialIsOpen,
        itemToString,
        stateReducer,
        onStateChange: ({ inputValue, type, selectedItem }: any) => {
            // console.log(type);
            switch (type) {
                case useCombobox.stateChangeTypes.InputChange:
                    setInputValue(inputValue)
                    break
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (selectedItem) {
                        setInputValue('');
                        // @ts-ignore
                        addSelectedItem(selectedItem);
                    }
                    break
                default:
                break
            }
        }
    };

    if (defaultHighlightedIndex !== null) {
        comboboxOptions.defaultHighlightedIndex = defaultHighlightedIndex;
    }

    const {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        // getComboboxProps,
        highlightedIndex,
        getItemProps,
        // inputValue,
        // selectedItem: internalSelectedItem
        // setInputValue
    } = useCombobox(comboboxOptions);

    let showValue = selectedItems.length > 0;

    const inputProps = getInputProps({
        ...getDropdownProps({ preventKeyAction: isOpen }),
        // ref: inputRef
    });

    return (
        <div 
            className="relative h-full w-full font-normal"
            // {...getComboboxProps()}
            tabIndex={0}
            onFocus={() => {
                // @ts-ignore
                inputRef.current.focus();
            }}
        >
            <div 
                // className="w-full flex items-center justify-between flex-wrap top-0 pt-0.5 pb-1.5 px-2 rounded-md border-gray-300 radius-md border bg-gray-200 dark:bg-gray-800 focus-within:bg-white focus-within:border-primary" //pointer-events-none
                className={clsx('w-full flex items-center justify-between flex-wrap form-input focus-within:!bg-gray-100 focus-within:!border-primary', {
                    'form-element-has-focus': hasFocus,
                    'form-element-has-value': selectedItems.length > 0
                })}
                // @ts-ignore
                ref={setReferenceElement}
            > 
                <span 
                    className={clsx('flex flex-1 flex-wrap items-center overflow-hidden')}
                >
                    {showValue && selectedItems.map((selectedItem, index) => {
                        // console.log(getSelectedItemProps({ selectedItem, index }));
                        return (
                            <span
                                className="pl-2 pr-1 bg-primary-lighter hover:bg-primary text-white rounded-sm mr-1 inline-flex items-center text-sm focus:outline-none"
                                key={index}
                                data-selected-item={index}
                                {...getSelectedItemProps({ selectedItem, index })}
                                onFocus={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                {itemToString(selectedItem)}
                                <FiX 
                                    className="ml-2 cursor-pointer"
                                    data-remove-item={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelectedItem(selectedItem);
                                    }}
                                />
                            </span>
                        )
                    })}
                    <input 
                        className="text-base m-0 p-0 appearance-none border-none bg-transparent focus:ring-0 focus:outline-none placeholder-gray-400"
                        // className="form-select"
                        placeholder={selectedItems.length > 0 ? null : placeholder}
                        type="text"
                        {...inputProps}
                        style={{ width: showValue ? 2 + (inputValue.length * 9) + 'px' : 'auto'}}
                        ref={(node: any) => {
                            inputProps.ref(node);

                            // @ts-ignore
                            inputRef.current = node;
                        }}
                        // FIXME: di default Downshift per il Combobox al blur dell'input seleziona l'oggetto correntemente evidenziato,
                        // non ho trovato soluzione migliore se non fare l'override dell'onBlur fornito da Downshift,
                        // verificare se si può trovare soluzione meno invasiva (magari modificando lo stateReducer)
                        onBlur={() => {
                            onBlur();
                            setHasFocus(false);
                        }}
                        onFocus={() => setHasFocus(true)}
                    />
                </span>
                <ToggleBtn 
                    className="self-stretch shrink-0"
                    isOpen={isOpen} 
                    {...getToggleButtonProps()} 
                />
            </div>
            <Dropdown 
                {...getMenuProps()} 
                elementRef={referenceElement} 
                // dropdownRef={dropdownRef} 
                isOpen={isOpen}
                position={dropdownPosition}
                fixed={dropdownFixed}
            >
                {(isOpen && optionsToDisplay.length > 0) && optionsToDisplay.map((item, index) => (
                    <DropdownItem
                        isHighlighted={highlightedIndex === index}
                        key={`${item}${index}`}
                        {...getItemProps({ item, index })}
                    >
                        <span
                            className="flex highlighted-text cursor-default"
                            dangerouslySetInnerHTML={{ __html: highlightString(inputValue, itemToString(item)) || '' }}   
                        />
                    </DropdownItem>
                ))}
                {(isOpen && optionsToDisplay.length === 0) && (
                    <DropdownItem 
                        isHighlighted={false}
                    >
                        <span>Nessun risultato</span>
                    </DropdownItem>
                )}
            </Dropdown>
        </div>
    );
});

interface ComboBoxMultipleFieldProps extends ComboBoxMultipleProps, FieldWrapperProps {};

export const ComboBoxMultipleField = React.forwardRef<any, ComboBoxMultipleFieldProps>((props: ComboBoxMultipleFieldProps, forwardRef) => {
    const inputId = uniqueId(`form-${props.name}_`);

    const comboBoxPropsName = Object.keys(new ComboBoxMultipleClass([]));

    // @ts-ignore
    const comboBoxProps: ComboBoxProps = pick(props, comboBoxPropsName);

    return (
        <FieldWrapper {...props} inputId={inputId}>
            <ComboBoxMultiple
                {...comboBoxProps}
                id={inputId}
                ref={forwardRef} 
            />
        </FieldWrapper>
    );
});

interface ComboBoxMultipleFieldControllerProps extends ComboBoxMultipleFieldProps {
    name: string;
    control: Control;
    defaultValue?: any;
};

export function ComboBoxMultipleFieldController({ name, control, defaultValue, ...rest}: ComboBoxMultipleFieldControllerProps) {
    const { field, fieldState } = useController({
        name,
        control,
        defaultValue
    });

    return (
        <ComboBoxMultipleField 
            {...field}
            {...rest}
            error={fieldState.error}
        />
    );
}
