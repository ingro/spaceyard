import React, { useState } from 'react';
// import { createPopper } from '@popperjs/core';
import { usePopper } from 'react-popper';
import clsx from 'clsx';
import { FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';

import { popperSameWidthModifier } from '../../utilities/dom';

type DropdownProps = {
    children: any;
    elementRef: any;
    dropdownRef?: any;
    isOpen: boolean;
    fixed?: boolean;
    position?: 'top' | 'bottom';
};

export const Dropdown = React.forwardRef<any, DropdownProps>(({ 
    children, 
    elementRef, 
    dropdownRef, 
    isOpen,
    fixed = false,
    position = 'bottom',
    ...rest 
}, forwardRef) => {
    // console.log(dropdownRef);
    console.log(elementRef?.offsetWidth);

    let [popperElement, setPopperElement] = useState();

    const { styles, attributes } = usePopper(isOpen ? elementRef : null, isOpen ? popperElement : null, {
        placement: position === 'bottom' ? 'bottom-start' : 'top-start',
        strategy: fixed ? 'fixed' : 'absolute',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 4],
                }
            },
            {
                // FIXME: per un bug nel mostrare la tendina all'interno di TableFilterDropdown (che a sua volta usa Popper per posizionarsi ho
                // dovuto disabilitare il flip in maniera da forzare il posizionamento in basso, indagare, se si vuole mantenere la possibilita
                // di "flippare" si potrebbe introdurre una prop di configurazione nel componente)
                name: 'flip',
                enabled: false,
                // options: {
                //     flipVariations: false
                // }
            },
            {
                // FIXME: per un bug nel mostrare la tendina all'interno di TableFilterDropdown (che a sua volta usa Popper per posizionarsi ho
                // dovuto disabilitare il preventOverflow in maniera da forzare il posizionamento allineato all'elemento di riferimento, 
                // indagare, se si vuole mantenere la possibilita di gestire l'overflow si potrebbe introdurre una prop di configurazione nel componente)
                name: 'preventOverflow',
                options: {
                    mainAxis: false
                },
            },
            // @ts-ignore
            popperSameWidthModifier
        ]
    });

    return (
        <ul 
            className={clsx('absolute bg-gray-50 dark:bg-gray-600 p-0 rounded-md overflow-y-auto z-10 outline-none max-h-80 text-base leading-6 shadow-lg', {
                'py-1 border border-gray-300': isOpen,
                'border-r-0': children.length > 7
            })}
            {...rest}
            style={styles.popper}
            {...attributes.popper}
            // style={elementRef && elementRef.current ? {
            //     width: elementRef.current.offsetWidth
            // } : {}}
            ref={(node: any) => {
                // @ts-ignore
                forwardRef(node);

                setPopperElement(node);

                // if (dropdownRef) {
                //     dropdownRef.current = node;
                // }
            }}
        >
            {children}
        </ul>
    );
});

export const DropdownItem = React.forwardRef<any, any>(({ children, isHighlighted, isSelected, ...rest }: any, forwardRef) => {
    return (
        <li
            className={clsx(`flex items-center p-2`, {
                'bg-primary': isSelected,
                'bg-gray-200 dark:bg-gray-300': isHighlighted && !isSelected,
                'text-gray-100': isSelected,
                'text-primary': isHighlighted && !isSelected
            })}
            {...rest}
            ref={forwardRef}
        >
            {children}
        </li>
    );
});

export const ToggleBtn = React.forwardRef<any, any>(({ children, isOpen, className, ...rest }, forwardRef) => {
    return (
        <span 
            className={clsx('combobox-controls', className)}
            {...rest}
            data-combobox-toggle
            ref={forwardRef}
        >
            {isOpen ? <FiChevronUp className="w-5 h-5"/> : <FiChevronDown className="w-5 h-5" />}
        </span>
    );
});

export function ClearBtn({ onClick, ...rest }: any) {
    return (
        <span 
            className="combobox-controls"
            onClick={onClick}
            {...rest}
        >
            <FiX />
        </span>
    );
}
