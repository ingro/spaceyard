import React, { useState, useMemo, useRef } from 'react';
import { matchSorter } from 'match-sorter';
import { useCombobox } from 'downshift';
import clsx from 'clsx';

import { Dropdown, DropdownItem, ClearBtn, ToggleBtn } from './shared/dropdown';
import { highlightString } from '../utilities/formatters';
import { SelectOption } from '../types';

type ComboBoxProps = {
    value?: any;
    onSelect?: (option: SelectOption) => void;
    onIsOpenChange?: (isOpen: boolean) => void;
    options: Array<SelectOption>;
    initialIsOpen?: boolean;
    // defaultHighlightedIndex?: number;
    placeholder?: string;
    itemToString?: (item: any) => string;
    filterKeys?: Array<string|Object>;
    dropdownPosition?: 'top' | 'bottom';
    dropdownFixed?: boolean;
};

const defaultItemToStringFn = (item: any) => item?.label;

function getItemFromValue(options: Array<any>, value: any) {
    let match = value;

    if (typeof value === 'object') {
        match = value.value;
    }

    return options.filter((option: any) => String(match) === String(option.value))[0];
}

export const ComboBox = React.forwardRef<any, ComboBoxProps>(({ 
    value, 
    onSelect, 
    onIsOpenChange, 
    options, 
    initialIsOpen = false, 
    // defaultHighlightedIndex = 0,
    placeholder = 'Cerca...',
    itemToString = defaultItemToStringFn,
    filterKeys = ['label'],
    dropdownPosition = 'bottom', 
    dropdownFixed = false
}, forwardRef) => {
    const localInputRef = useRef(null);
    // const containerRef = useRef(null);
    // const dropdownRef = useRef(null);

    let [referenceElement, setReferenceElement] = useState();

    const inputRef = forwardRef || localInputRef;

    const [optionsToDisplay, setOptionsToDisplay] = useState(options);
    const [hasFocus, setHasFocus] = useState(false);

    const internalSelectedItemRef = useRef(null);
    
    const selectedItem = useMemo(() => {
        return value ? getItemFromValue(optionsToDisplay, value) : null;
        // eslint-disable-next-line
    }, [value]);

    // const selectedItem = value ? getItemFromValue(optionsToDisplay, value) : null;

    internalSelectedItemRef.current = selectedItem;

    // @ts-ignore
    // console.log(internalSelectedItemRef.current.label);

    function stateReducer(state: any, actionAndChanges: any) {
        const { type, changes } = actionAndChanges;
    
        // console.log(type);
        // console.log(changes);
        // console.log(state);
    
        switch (type) {
            case useCombobox.stateChangeTypes.ItemClick:
            case useCombobox.stateChangeTypes.InputKeyDownEnter:
            case useCombobox.stateChangeTypes.FunctionSelectItem:
            case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
            // FIXME: all'inizializzazione con value = null viene triggherato l'evento ControlledPropUpdatedSelectedItem 
            // con inputProps.value = undefined, investigare...
                
                // Devo impostarlo qui in maniera da non generare side-effects per sapere se
                // il valore ?? cambiato, dato che il valore proviene dall'esterno
                internalSelectedItemRef.current = changes.selectedItem;

                return {
                    ...changes,
                    inputValue: ''
                };
            case useCombobox.stateChangeTypes.InputChange:
                if (! changes.highlightedIndex) {
                    return {
                        ...changes,
                        highlightedIndex: 0
                    };
                }
                
                return changes;
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
        selectedItem,
        items: optionsToDisplay,
        onInputValueChange: ({ inputValue }: any) => {
            let newOptionsToDisplay: Array<any> = options;

            if (inputValue !== '') {
                newOptionsToDisplay = matchSorter(options, inputValue, { keys: filterKeys });
            }

            setOptionsToDisplay(newOptionsToDisplay);
        },
        initialInputValue: '',
        initialIsOpen,
        defaultHighlightedIndex: selectedItem ? undefined : 0,
        // initialSelectedItem: selectedItem,
        itemToString,
        stateReducer,
        /*onStateChange: (changes: any) => {
            if (changes.selectedItem) {
                internalSelectedItemRef.current = changes.selectedItem;
            }
        },*/
        onSelectedItemChange: (changes: any) => {
            // console.log(changes);
            // if (changes.selectedItem && onSelect) {
            if (onSelect) {
                onSelect(changes.selectedItem);
                // setShowValue(true);
            }
        },
        onIsOpenChange: ({ isOpen }: any) => {
            if (onIsOpenChange) {
                onIsOpenChange(isOpen);
            }
        }
    };

    // if (defaultHighlightedIndex !== null) {
    //     comboboxOptions.defaultHighlightedIndex = defaultHighlightedIndex;
    // }

    const {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
        inputValue,
        selectItem,
        // selectedItem: internalSelectedItem
        // setInputValue
    } = useCombobox(comboboxOptions);

    // console.log(internalSelectedItem);
    // console.log(selectedItem.value);
    // console.log(internalSelectedItemRef.current.value);
    // console.log(inputValue);

    let showValue = false;

    // FIXME: selectedItem viene comandato esternamente dalla prop value mentre inputValue proviene dallo stato interno di useCombobox
    // questo provoca il problema quando si passa da un valore selezionato all'altro, al click sull'oggetto inputValue viene portato
    // dallo stateReducer a '' ed essendo selectedItem gi?? valorizzato (con la precedente opzione) questa viene visualizzata per una frazione
    // di secondo fin quando non viene aggiornata anche la prop value esternamente. Se passo `selectedItem` a useCombobox infatti questo avra sempre
    // la precedenza rispetto a quello calcolato internamente. Si potrebbe ovviare non passando selectedItem all'hook e lasciargli usare il suo 
    // interno, ma a questo punto come si comporterebbe il select in caso di modifiche esterne? Investigare.
    // @ts-ignore
    if (internalSelectedItemRef.current && inputValue === ''/* && selectedItem.value === internalSelectedItemRef.current.value*/) {
        // console.warn(selectedItem.label);
        showValue = true;
    }

    const inputProps = getInputProps({
        ref: inputRef
    });

    return (
        <div 
            className={clsx('relative w-full font-normal', {
                'form-select-open': isOpen,
                'form-element-has-focus': hasFocus
            })}
            {...getComboboxProps()}
            // ref={containerRef}
        >
            <input 
                className={clsx('form-select', {
                    'form-element-has-value': selectedItem
                })}
                placeholder={selectedItem ? null : placeholder}
                type="text"
                {...inputProps}
                // FIXME: di default Downshift per il Combobox al blur dell'input seleziona l'oggetto correntemente evidenziato,
                // non ho trovato soluzione migliore se non fare l'override dell'onBlur fornito da Downshift,
                // verificare se si pu?? trovare soluzione meno invasiva (magari modificando lo stateReducer)
                onBlur={() => setHasFocus(false)}
                onFocus={() => setHasFocus(true)}
            />
            <div 
                className="w-full h-full flex items-center absolute top-0 px-2 pointer-events-none" 
                // @ts-ignore
                ref={setReferenceElement}
            >
                <span className={clsx('combobox-value flex-grow', { 'show-value': showValue })}>
                    {showValue && itemToString(internalSelectedItemRef.current)}
                </span>
                {selectedItem && (
                    <ClearBtn
                        onClick={() => {
                            selectItem(null);
                            // @ts-ignore
                            if (inputRef && inputRef.current) {
                                // @ts-ignore
                                inputRef.current.focus();
                            }
                        }}
                    />
                )}
                <ToggleBtn isOpen={isOpen} {...getToggleButtonProps()} />
            </div>
            <Dropdown 
                {...getMenuProps()} 
                elementRef={referenceElement} 
                // dropdownRef={dropdownRef} 
                isOpen={isOpen}
                position={dropdownPosition}
                fixed={dropdownFixed}
            >
                {isOpen &&
                    optionsToDisplay.map((item, index) => (
                    <DropdownItem
                        isSelected={item === selectedItem}
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
