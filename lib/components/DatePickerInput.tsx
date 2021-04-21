import React, { useState, useEffect, useRef, useMemo } from "react";
import Calendar from 'react-calendar';
import { Control, useController } from "react-hook-form";
import parse from "date-fns/parse";
import format from "date-fns/format";
import { useTranslation } from "react-i18next";
import { FiX, FiCalendar } from "react-icons/fi";
import pick from "lodash/pick";
import uniqueId from "lodash/uniqueId";
import clsx from "clsx";

import { useDisclosure } from "../hooks/useDisclosure";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { FieldWrapper, FieldWrapperProps } from "./FieldWrapper";

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

class DatePickerInputClass {
    constructor(
        public value: string | Date | null,
        public onChange: (date: string | Date | null) => void,
        public asString?: boolean,
        public closeOnSelect?: boolean,
        public dateFormat?: string,
        public id?: string,
        public maxDate?: Date,
        public minDate?: Date,
        public placeholder?: string,
    ) {}
};

interface DatePickerInputProps extends DatePickerInputClass {};

export const DatePickerInput = React.forwardRef<any, DatePickerInputProps>(({
    asString = false,
    id,
    value,
    onChange = () => {},
    dateFormat = 'yyyy-MM-dd',
    closeOnSelect = true,
    placeholder = 'Seleziona una data',
    maxDate,
    minDate
}, forwardRef) => {
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

    let finalInputRef = inputRef;

    if (forwardRef) {
        // @ts-ignore
        finalInputRef = useMemo(() => {
            return (e: any) => {
                // @ts-ignore
                forwardRef(e);
                inputRef.current = e;
            }
        }, [inputRef, forwardRef])
    }

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
                ref={finalInputRef}
                className={clsx('form-input cursor-default', {
                    'group-hover:border-gray-400': !isOpen
                })}
                value={date ? new Intl.DateTimeFormat(i18n.language).format(date) : ''}
                onChange={() => {}}
                onClick={open}
                onBlur={handleBlur}
                onFocus={open}
                placeholder={placeholder}
                id={id}
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
                <div className="absolute z-10">
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
});

interface DatePickerInputFieldProps extends DatePickerInputProps, FieldWrapperProps {};

export const DatePickerInputField = React.forwardRef<any, DatePickerInputFieldProps>((props, forwardRef) => {
    const inputId = uniqueId(`form-${props.name}_`);

    const inputPropsName = Object.keys(new DatePickerInputClass('', () => {}));

    // @ts-ignore
    const inputProps: DatePickerInputProps = pick(props, inputPropsName);

    return (
        <FieldWrapper {...props} inputId={inputId}>
            <DatePickerInput
                {...inputProps}
                ref={forwardRef} 
            />
        </FieldWrapper>
    );
});

interface DatePickerInputFieldControllerProps extends DatePickerInputFieldProps {
    name: string;
    control: Control;
    defaultValue?: any;
};

export function DatePickerInputFieldController({ name, control, defaultValue, ...rest}: DatePickerInputFieldControllerProps) {
    const { field, fieldState } = useController({
        name,
        control,
        defaultValue
    });

    return (
        <DatePickerInputField 
            {...field}
            {...rest}
            error={fieldState.error}
        />
    );
}
