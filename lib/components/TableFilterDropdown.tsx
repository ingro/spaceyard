import React, { useRef, useEffect, useState } from 'react';
import { createPopper } from '@popperjs/core';
import { MoveFocusInside } from 'react-focus-lock';
// import { useLocalHotkey, useDisclosure, useOnClickOutside, InputSearch, DatePickerInput } from '@ingruz/spaceyard';
import { TiFilter } from "react-icons/ti";
import { FiX } from 'react-icons/fi';
import clsx from 'clsx';

import { useLocalHotkey } from '../hooks/hotkeyHooks';
import { useDisclosure } from '../hooks/useDisclosure';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { InputSearch } from './InputSearch';
import { DatePickerInput } from './DatePickerInput';

function renderFilterControl(filterControl: string, filterKey: string, filterProps: any, reducer: any, close: Function) {
    if (filterControl === 'search') {
        return (
            <InputSearch
                value={reducer.state.filters[filterKey]}
                onSubmit={(value: string) => {
                    reducer.actions.setFilter(filterKey, value);
                    close();
                }}
                onClear={() => reducer.actions.setFilter(filterKey, null)}
                showIcon={false}
                {...filterProps}
            />
        );
    }

    if (filterControl === 'date') {
        return (
            <DatePickerInput 
                value={reducer.state.filters.date}
                asString={true}
                onChange={(date: any) => {
                    reducer.actions.setFilter('date', date);
                    close();
                }}
                {...filterProps}
            />
        )
    }

    return null;
}

type TableFilterDropdownProps = {
    children: any;
    column: any;
    filterControl?: string;
    filterKey: string;
    filterProps: any;
    reducer: any;
};

export function TableFilterDropdown(props: TableFilterDropdownProps) {
    const { 
        column: { filterValue, id/*preFilteredRows,  setFilter*/ }, 
        children,
        // properFilterValue, 
        filterControl = null, 
        filterProps = {},
        reducer
    } = props;

    // console.log(props);

    let { filterKey } = props;

    if (! filterKey) {
        filterKey = id;
    }

    const { toggle, isOpen, close, open } = useDisclosure();
    const [isHover, setIsHover] = useState(false);
    // const [isClosing, setIsClosing] = React.useState(false);
    
    const toggleRef = useRef(null);
    const dropdownRef = useRef(null);
    const popperRef = useRef(null);

    // @ts-ignore
    // console.log(toggleRef?.current?.parentElement);
    
    // const handleClose = React.useCallback(() => {
    //     console.warn('HANDLE CLOSE');

    //     setIsClosing(true);
    //     // eslint-disable-next-line
    // }, []);

    useLocalHotkey('Escape', () => close(), dropdownRef);

    // @ts-ignore
    useOnClickOutside(dropdownRef, (event: MouseEvent) => {
        // @ts-ignore
        if (event.target === toggleRef.current || toggleRef.current.contains(event.target)) {
            return;
        }

        if (isOpen) {
            close()  
        };
    });

    useEffect(() => {
        if ((isOpen || isHover) && toggleRef.current && dropdownRef.current) {
            // console.log(toggleRef.current.parentElement.getBoundingClientRect());
            // @ts-ignore
            popperRef.current = createPopper(toggleRef.current.parentElement, dropdownRef.current, {
                placement: 'bottom-start',
                strategy: 'fixed',
                modifiers: [
                    // {
                    //     name: 'flip',
                    //     enabled: false
                    // },
                    // {
                    //     name: 'offset',
                    //     options: {
                    //         offset: [0, 1]
                    //     }
                    // }
                ]
            });
        } else if (isOpen === false && popperRef.current) {
            // @ts-ignore
            popperRef.current.destroy();
            popperRef.current = null;
        }
    }, [isOpen, isHover]);

    const computedFilterValue = filterValue || reducer?.state?.filters[filterKey];

    // const AnimatedContainer = animated.div;

    // // @ts-ignore
    // const { height, opacity } = useSpring({
    //     from: { height: 0, opacity: 0 },
    //     to: { height: (isOpen && isClosing === false) ? 75 : 0, opacity: (isOpen && isClosing === false) ? 1 : 0 },
    //     onRest() {
    //         // console.log(isOpen);
    //         if (isClosing) {
    //             close();
    //             setIsClosing(false);
    //         }
    //     }
    // });

    return (
        <>
            {computedFilterValue && (
                <div 
                    className="flex h-full items-center cursor-pointer ml-auto hover:text-blue-500"
                    onClick={(e) => {
                        e.stopPropagation();
                        reducer.actions.setFilter(filterKey, null)
                    }}
                    title="Remove filter"
                >
                    <FiX className="w-5 h-5"/>
                </div>
            )}
            <div 
                className={clsx('flex h-full items-center hover:text-blue-500 cursor-pointer', { 
                    'text-blue-500': computedFilterValue,
                    'ml-auto': ! computedFilterValue
                })} 
                ref={toggleRef}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                }}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        open();
                    }
                }}
                // onFocus={() => open()}
                // onBlur={() => close()}
                tabIndex={0}
                title="Open filter panel"
                data-toggle-filter={filterKey}
            >
                <TiFilter className="w-6 h-6"/>
            </div>
            <div
                title=""
                ref={dropdownRef}
                data-state={isOpen ? 'open' : 'closed'}
                data-filter-dropdown-id={filterKey}
                // style={{ opacity, height, willChange: 'opacity, height' }}
                className={clsx('z-10 border border-gray-500 rounded-b-md p-4 bg-white w-64 font-normal', {
                    'hidden': isOpen === false,
                    'fixed': isOpen
                })}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {isOpen && (
                    <MoveFocusInside>
                        {filterControl 
                            ? renderFilterControl(filterControl, filterKey, filterProps, reducer, close)
                            : children({ close })
                        }
                    </MoveFocusInside>
                )}
            </div>
        </>
    );
}

// const transition = useSpring({
//     from: {
//         opacity: '0',
//         transform: 'scale(0.50)'
//     },
//     to: {
//         opacity: isOpen ? '1' : '0',
//         transform: `scale(${isOpen ? '1' : '0.50'})`
//     }
// });

/* <div
    title=""
    ref={dropdownRef}
    data-state={isOpen ? 'open' : 'closed'}
    data-filter-dropdown-id={filterKey}
    // style={{ opacity, height, willChange: 'opacity, height' }}
    className="z-10 fixed"
    onClick={(e) => {
        e.stopPropagation();
    }}
>
    <animated.div 
        className="border border-gray-500 rounded-b-md p-4 bg-white w-64 origin-top-left"
        style={transition}
    >
        {isOpen && (
            <MoveFocusInside>
                {filterControl 
                    ? renderFilterControl(filterControl, filterKey, filterProps, reducer, close)
                    : children({ close })
                }
            </MoveFocusInside>
        )}
    </animated.div>
</div> */
