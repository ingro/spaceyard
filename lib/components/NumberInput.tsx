import React, { useMemo, useRef, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import {useNumberFieldState} from '@react-stately/numberfield';
import {useLocale} from '@react-aria/i18n';
import {useNumberField} from '@react-aria/numberfield';
import {useButton} from '@react-aria/button';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import clsx from 'clsx';

import { Input } from './Input';
import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';

class NumberInputClass {
    constructor(
        public className?: string,
        public defaultValue?: number,
        public error?: any,
        public formatOptions?: any,
        public id?: string,
        public label?: string,
        public maxValue?: number,
        public minValue?: number,
        public name?: string,
        public onChange?: (value: any) => void,
        public placeholder?: string,
        public step?: number,
        public value?: number
    ) {}
};

interface NumberInputProps extends NumberInputClass {};

function NumberInputButton({ children, ...rest }: any) {
    return (
        <button {...rest} className="hover:text-gray-600 hover:bg-gray-200 leading-none px-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-current">
            {children}
        </button>
    )
}

export const NumberInput = React.forwardRef<any, NumberInputProps>((props, forwardRef) => {
    const { locale } = useLocale();

    const onChange = props.onChange ? props.onChange : () => {};

    const [inputHasFocus, setInputHasFocus] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const state = useNumberFieldState({ 
        // FIXME: se l'onChange del Controller di RHF viene eseguito insieme a quello di useNumberFieldState
        // React tira un errore di un componente che mentre si sta renderizzando qualcuno cambia il suo stato interno
        // aggiungendo un timeout di 0 si evita il problema
        ...omit(props, ['onChange', 'value']),
        onChange: number => {
            setTimeout(() => {
                onChange(number)
            }, 0);
        },
        // value: props.value || '',
        locale 
    });

    const inputRef = useRef(null);

    let finalRef = inputRef;

    if (forwardRef) {
        // @ts-ignore
        finalRef = useMemo(() => {
            return (e: any) => {
                // @ts-ignore
                forwardRef(e);
                inputRef.current = e;
            }
        }, [inputRef, forwardRef])
    }

    const {
        // labelProps,
        groupProps,
        inputProps,
        incrementButtonProps,
        decrementButtonProps
        // @ts-ignore
    } = useNumberField({
        ...props,
        // FIXME: al momento l'rc0 di useNumberField ha un bug con gli eventi di focus quindi questo non funziona...
        onFocusChange: isFocused => setInputHasFocus(isFocused) 
        // @ts-ignore
    }, state, inputRef);

    // @ts-ignore
    const {buttonProps: incrementProps} = useButton(incrementButtonProps);
    // @ts-ignore
    const {buttonProps: decrementProps} = useButton(decrementButtonProps);

    const hasValue = inputProps.value && inputProps.value !== '';
    
    return (
        <div className={clsx('group relative', {
            'form-element-has-value': hasValue
        })} 
        {...groupProps}
        >
            {/* @ts-ignore */}
            <Input 
                className={clsx('form-input', {
                    '!border-gray-400': isHover && !inputHasFocus
                })}
                ref={finalRef} 
                {...inputProps} 
            />
            <div 
                className="absolute right-0 flex flex-col text-gray-400" 
                style={{ top: '1px', right: '1px' }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <NumberInputButton {...incrementProps}>
                    <FiChevronUp style={{ display: 'inline' }}/>
                </NumberInputButton>
                <NumberInputButton {...decrementProps}>
                    <FiChevronDown style={{ display: 'inline' }}/>
                </NumberInputButton>
            </div>
        </div>
    );
});

interface NumberInputFieldProps extends NumberInputProps, FieldWrapperProps {};

export const NumberInputField = React.forwardRef<any, NumberInputFieldProps>((props, forwardRef) => {
    const inputId = uniqueId(`form-${props.name}_`);

    const inputPropsName = Object.keys(new NumberInputClass());

    const inputProps: NumberInputProps = pick(props, inputPropsName);

    return (
        <FieldWrapper {...props} inputId={inputId}>
            <NumberInput
                {...inputProps}
                id={inputId}
                ref={forwardRef} 
            />
        </FieldWrapper>
    );
});

interface NumberInputFieldControllerProps extends NumberInputFieldProps {
    name: string;
    control: Control;
    defaultValue?: any;
};

export function NumberInputFieldController({ name, control, defaultValue, ...rest}: NumberInputFieldControllerProps) {
    const { field, fieldState } = useController({
        name,
        control,
        defaultValue
    });

    return (
        <NumberInputField 
            {...field}
            {...rest}
            error={fieldState.error}
        />
    );
}
