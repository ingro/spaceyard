import React from 'react';
import clsx from 'clsx';
import { useController, Control } from 'react-hook-form';
import uniqueId from 'lodash/uniqueId';
import pick from 'lodash/pick';

import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';

type SwitchProps = {
    checked?: boolean;
    error?: any;
    label?: string;
    labelPosition?: string;
    onBlur?: () => void;
    onChange?: (checked: boolean) => void;
    value?: boolean;
};

interface SwitchFieldProps extends SwitchProps, FieldWrapperProps {};

export const Switch = React.forwardRef<any, SwitchProps>(({ checked, label, onChange = () => {}, onBlur = () => {}, labelPosition = 'right' }, forwardRef) => {
    return (
        <div 
            className="flex items-center focus:outline-none justify-start select-none"
            onBlur={onBlur}
            // tabIndex={0}
        >
            <button
                type="button"
                onClick={() => onChange(!checked)} 
                className={clsx(
                    {
                        "bg-primary": checked,
                        "bg-gray-200": !checked
                    },
                    'relative inline-flex flex-shrink-0 h-5 transition-color duration-200 border-2 border-transparent rounded-full cursor-pointer w-10 focus:outline-none focus:ring'
                )}
                ref={forwardRef}
            >
                <span
                    className={`${
                    checked ? "translate-x-5" : "translate-x-0"
                    } inline-block w-4 h-4 transition duration-200 transform bg-white rounded-full`}
                />
            </button>
            {labelPosition !== 'none' && 
                <label
                    onClick={() => onChange(!checked)} 
                    className={clsx('inline-block cursor-pointer dark:text-gray-300', { 
                        'order-first': labelPosition === 'left', 
                        'pr-2': labelPosition === 'left',
                        'pl-2': labelPosition === 'right',
                    })
                }>
                    {label}
                </label>
            }
        </div>
    );
});

export const SwitchField = React.forwardRef<any, SwitchFieldProps>((props: any, forwardRef) => {
    const inputId = uniqueId(`form-${props.name}_`);

    const inputPropsName = ['label', 'onChange', 'onBlur', 'labelPosition'];

    // @ts-ignore
    const inputProps: InputProps = pick(props, inputPropsName);

    return (
        <FieldWrapper {...props} inputId={inputId}>
            <Switch
                {...inputProps}
                checked={props.checked || props.value}
                id={inputId}
                ref={forwardRef} 
            />
        </FieldWrapper>
    );
});

interface SwitchFieldControllerProps extends SwitchFieldProps {
    name: string;
    control: Control;
    defaultValue?: any;
};

export function SwitchFieldController({ name, control, defaultValue, ...rest}: SwitchFieldControllerProps) {
    const { field, fieldState } = useController({
        name,
        control,
        defaultValue
    });

    return (
        <SwitchField 
            {...field}
            {...rest}
            error={fieldState.error}
        />
    );
}
