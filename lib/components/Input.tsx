import React, { useMemo } from 'react';
import clsx from 'clsx';
import pick from 'lodash/pick';
import uniqueId from 'lodash/uniqueId';

import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';
import { Control, useController } from 'react-hook-form';

type InputProps = {
    className?: string;
    defaultValue?: string;
    error?: any;
    id?: string;
    name?: string;
    onChange?: any;
    onInput?: any;
    onKeyUp?: any;
    placeholder?: string;
    type?: string;
    value?: string;
};

export const Input = React.forwardRef<any, InputProps>(({ name, className = 'form-input', placeholder, error, type = 'text', children, ...rest }, forwardRef) => {
    return (
        <input
            placeholder={placeholder || name}
            name={name}
            className={clsx(className, {
                'border-danger': error
            })}
            ref={forwardRef}
            type={type}
            {...rest}
        />
    );
});

interface InputFieldProps extends InputProps, FieldWrapperProps {};

export const InputField = React.forwardRef<any, InputFieldProps>((props: any, forwardRef) => {
    const inputId = uniqueId(`form-${props.name}_`);

    const inputPropsName = ['name', 'className', 'placeholder', 'error', 'type', 'defaultValue', 'onChange', 'onBlur'];

    // @ts-ignore
    const inputProps: InputProps = pick(props, inputPropsName);

    return (
        <FieldWrapper {...props} inputId={inputId}>
            <Input
                {...inputProps}
                id={inputId}
                ref={forwardRef} 
            />
        </FieldWrapper>
    );
});

interface InputFieldControllerProps extends InputFieldProps {
    name: string;
    control: Control;
    defaultValue?: any;
    inputRef?: any;
};

export function InputFieldController({ name, control, defaultValue, inputRef, ...rest }: InputFieldControllerProps) {
    const { field, fieldState } = useController({
        name,
        control,
        defaultValue
    });

    const ref = useMemo(() => {
        if (!inputRef) {
            return field.ref;
        }

        return (e: any) => {
            // @ts-ignore
            field.ref(e);
            inputRef.current = e;
        }
    // eslint-disable-next-line
    }, [inputRef, field.ref]);

    return (
        <InputField 
            {...field}
            {...rest}
            ref={ref}
            error={fieldState.error}
        />
    );
}
