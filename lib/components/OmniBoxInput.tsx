import React, { useState } from 'react';
import { useCombobox } from 'downshift';
import { matchSorter } from 'match-sorter';
import { useHistory } from 'react-router';
import clsx from 'clsx';

import { highlightString } from '../utilities/formatters';
import { OmniBoxAction } from '../types';

const itemToString = (item: any) => item ? item.label : '';

type OmniBoxInputProps = {
    onSelect: () => void;
    onIsOpenChange: (isOpen: boolean) => void;
    options: Array<OmniBoxAction>;
};

export const OmniBoxInput = React.forwardRef<any, OmniBoxInputProps>(({ onSelect, onIsOpenChange, options }, forwardRef) => {
    const [optionsToDisplay, setOptionsToDisplay] = useState<Array<OmniBoxAction>>(options);

    const history = useHistory();

    const {
        isOpen,
        // getToggleButtonProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
        inputValue
    } = useCombobox({
            items: optionsToDisplay,
            onInputValueChange: ({ inputValue }) => {
                // @ts-ignore
                let newOptionsToDisplay: Array<OmniBoxAction> = options;

                if (inputValue && inputValue !== '') {
                    newOptionsToDisplay = matchSorter(options, inputValue, { keys: ['label'] });
                }

                setOptionsToDisplay(newOptionsToDisplay);
            },
            initialIsOpen: true,
            defaultHighlightedIndex: 0,
            itemToString,
            // onStateChange: changes => console.log(changes),
            onSelectedItemChange: (changes) => {
                if (changes.selectedItem) {
                    // console.log(changes);
                    if (typeof changes.selectedItem.value === 'function') {
                        changes.selectedItem.value();
                    } else {
                        history.push(changes.selectedItem.value);
                    }
                    
                    onSelect();
                }
            },
            onIsOpenChange: ({ isOpen }) => {
                if (typeof isOpen !== 'undefined') {
                    onIsOpenChange(isOpen)
                }
            }
        }
    );

    const inputProps = getInputProps({
        ref: forwardRef
    });

    return (
        <div {...getComboboxProps()}>
            <input 
                className="w-full text-2xl bg-gray-600 text-gray-300 p-2 outline-none border-none"
                placeholder="Cerca azione..."
                type="text"
                {...inputProps}
                // FIXME: di default Downshift per il Combobox al blur dell'input seleziona l'oggetto correntemente evidenziato,
                // non ho trovato soluzione migliore se non fare l'override dell'onBlur fornito da Downshift,
                // verificare se si può trovare soluzione meno invasiva (magari modificando )
                onBlur={() => {}}
                // onKeyUp={(e) => {
                //     if (e.key === 'Tab') {
                //         e.preventDefault();

                //         // @ts-ignore
                //         const query = e.target.value;

                //         if (query === 'xxx') {
                //             // @ts-ignore
                //             forwardRef.current.value = `${query} `
                //         }
                //     }
                // }}
            />
            <ul 
                className="m-0 p-0 mt-2"
                {...getMenuProps()}
            >
                {isOpen &&
                    optionsToDisplay.map((item, index) => (
                    <li
                        className={clsx(`flex items-center text-gray-300 text-xl p-2`, {
                            'bg-primary': highlightedIndex === index
                        })}
                        key={`${item}${index}`}
                        {...getItemProps({ item, index })}
                    >
                        <span className="flex mr-4"><item.Icon/></span>
                        <span
                            className="flex highlighted-text"
                            dangerouslySetInnerHTML={{ __html: highlightString(inputValue, itemToString(item)) || '' }}   
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
});
