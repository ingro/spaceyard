import React, { useRef, useEffect, useState } from 'react';
import { createPopper } from '@popperjs/core';
import { MoveFocusInside } from 'react-focus-lock';
// import { useLocalHotkey, useDisclosure, useOnClickOutside, InputSearch, DatePickerInput } from '@ingruz/spaceyard';
import { TiFilter } from "react-icons/ti";
import { FiX } from 'react-icons/fi';
import { Column, Table } from '@tanstack/react-table';
import clsx from 'clsx';

import { useLocalHotkey } from '../hooks/hotkeyHooks';
import { useDisclosure } from '../hooks/useDisclosure';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { InputSearch } from './InputSearch';
import { DatePickerInput } from './DatePickerInput';
import { Select } from './Select';

type renderFilterControlProps = {
    filterControl: 'search' | 'date' | 'select';
    filterProps: any;
    column: Column<any>;
    close: Function;
};

function renderFilterControl({ filterControl, filterProps, column, close }: renderFilterControlProps) {
    if (filterControl === 'search') {
        return (
            <InputSearch
                value={column.getFilterValue()}
                onSubmit={(value: string) => {
                    column.setFilterValue(value);
                    close();
                }}
                onClear={() => column.setFilterValue(null)}
                showIcon={false}
                {...filterProps}
            />
        );
    }

    if (filterControl === 'date') {
        return (
            <DatePickerInput 
                value={column.getFilterValue()}
                asString={true}
                onChange={(date: any) => {
                    column.setFilterValue(date)
                    close();
                }}
                {...filterProps}
            />
        )
    }

    if (filterControl === 'select') {
        return (
            <Select 
                value={column.getFilterValue()}
                onChange={(option: any) => {
                    column.setFilterValue(option?.value || null);
                    close();
                }}
                {...filterProps}
            />
        );
    }

    return null;
}

type TableFilterDropdownProps = {
    table: Table<any>;
    children: any;
    column: Column<any>;
    filterControl?: 'search' | 'date' | 'select';
    filterProps: any;
    filterKey: string;
};

export function TableFilterDropdown(props: TableFilterDropdownProps) {
    const {
        table,
        column, 
        children,
        filterControl = null, 
        filterProps = {}
    } = props;

    // console.log(props);

    let { filterKey } = props;

    let filterColumn = column;

    if (! filterKey) {
        filterKey = column.id;
    } else {
        filterColumn = table.getColumn(filterKey) || column;
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

    // const computedFilterValue = filterValue || reducer?.state?.filters[filterKey];

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

    const isFiltered = filterColumn?.getIsFiltered() || false;

    return (
        <>
            {isFiltered && (
                <div 
                    className="flex h-full items-center cursor-pointer ml-auto hover:text-blue-500"
                    onClick={(e) => {
                        e.stopPropagation();
                        filterColumn?.setFilterValue(null);
                    }}
                    title="Remove filter"
                >
                    <FiX className="w-5 h-5"/>
                </div>
            )}
            <div 
                className={clsx('flex h-full items-center hover:text-blue-500 cursor-pointer', { 
                    'text-blue-500': isFiltered,
                    'ml-auto': ! isFiltered
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
                    <>
                        <MoveFocusInside>
                            {filterControl 
                                ? renderFilterControl({ filterControl, filterProps, column: filterColumn, close })
                                : children({ close, column: filterColumn })
                            }
                        </MoveFocusInside>
                    </>
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
