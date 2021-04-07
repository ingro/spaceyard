import React from 'react';
import clsx from 'clsx';

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
