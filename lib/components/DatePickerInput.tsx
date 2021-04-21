import React, { useState, useEffect, useRef } from "react";
import Calendar from 'react-calendar';
import parse from "date-fns/parse";
import format from "date-fns/format";
import { useTranslation } from "react-i18next";
import { FiX, FiCalendar } from "react-icons/fi";
import clsx from "clsx";

import { useDisclosure } from "../hooks/useDisclosure";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

function hasGivenParent(element: any, parentEl: any): boolean {
    if (element === parentEl) {
        return true;
    }

    return element.parentNode && hasGivenParent(element.parentNode, parentEl);
}

function getDate(inputDate: string | Date, dateFormat: string): Date {
    if (inputDate instanceof Date) {
        return inputDate;
    }

    return parse(inputDate, dateFormat, new Date());
}

type DatePickerInputProps = {
    asString?: boolean;
    closeOnSelect?: boolean;
    dateFormat?: string;
    maxDate?: Date;
    minDate?: Date;
    onChange: (date: string | Date | null) => void;
    placeholder?: string;
    value: string | Date | null;
};

export function DatePickerInput({
    asString = false,
    value,
    onChange = () => {},
    dateFormat = 'yyyy-MM-dd',
    closeOnSelect = true,
    placeholder = 'Seleziona una data',
    maxDate,
    minDate
}: DatePickerInputProps) {
    const { open, close, /*toggle,*/ isOpen } = useDisclosure();
    const [date, setDate] = useState(value ? getDate(value, dateFormat) : null);

    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const toggleRef = useRef(null);

    const { i18n } = useTranslation();

    useEffect(() => {
        setDate(value ? getDate(value, dateFormat) : null);
    }, [value, dateFormat]);

    useOnClickOutside(wrapperRef, close);

    // Se dopo aver fatto il blur sull'input in un qualcosa fuori dal wrapper chiudo il calendario
    function handleBlur(e: any) {
        setTimeout(() => {
            const currentFocusEl = document.activeElement;

            if (hasGivenParent(currentFocusEl, wrapperRef.current)) {
                return;
            }

            close();
        }, 0);
    }

    // FIXME: Input mask?
    return (
        <div className="relative group w-full" ref={wrapperRef}>
            <input
                ref={inputRef}
                className={clsx('form-input cursor-default', {
                    'group-hover:border-gray-400': !isOpen
                })}
                value={date ? new Intl.DateTimeFormat(i18n.language).format(date) : ''}
                onChange={() => {}}
                onClick={open}
                onBlur={handleBlur}
                onFocus={open}
                placeholder={placeholder}
                style={{ // Trick per non mostrare il cursore
                    color: 'transparent',
                    textShadow: '0 0 0 #000'
                }}
            />
            <span className="absolute flex inset-y-0 right-0 pr-1">
                {date && (
                    <span className="flex items-center cursor-pointer text-gray-400 hover:text-gray-700 mr-2" onClick={() => onChange(null)}>
                        <FiX className="h-5 w-5"/>
                    </span>
                )}
                <span 
                    className="flex items-center cursor-pointer text-gray-400 hover:text-gray-700 outline-none select-none" 
                    tabIndex={0} 
                    ref={toggleRef} 
                    onClick={(e) => {
                        if (! isOpen) {
                            // @ts-ignore
                            inputRef?.current?.focus();
                        } else {
                            close();
                        }
                        // toggle();
                    }}
                >
                    <FiCalendar className="h-5 w-5"/>
                </span>
            </span>
            {isOpen && (
                <div className="absolute">
                    <Calendar
                        locale={i18n.language}
                        maxDate={maxDate}
                        minDate={minDate}
                        value={date}
                        onChange={(d: any) => {
                            if (asString) {
                                onChange(d ? format(d, dateFormat) : null);
                            } else {
                                onChange(d);
                            }

                            if (closeOnSelect) {
                                close();
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
