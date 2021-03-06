import React from 'react';
import clsx from 'clsx';
import defaults from 'lodash/defaults';

// import '../styles/form.css';

type FieldWrapperClassNames = {
    helper?: string;
    inputWrapper?: string;
    label?: string;
    labelWrapper?: string;
    wrapper?: string;
};

type Layouts = 'inline' | 'stacked' | 'onlyInput';

export type FieldWrapperProps = {
    error?: any;
    label?: string;
    layout?: Layouts;
    name?: string;
    placeholder?: string;
    helper?: string;
    inputId?: string;
    children?: any;
    classNames?: FieldWrapperClassNames;
};

const DEFAULT_CLASSNAMES: Record<Layouts, FieldWrapperClassNames> = {
    inline: {
        helper: '',
        inputWrapper: 'w-3/5',
        label: 'block text-gray-600 dark:text-gray-400 text-right mb-0 pr-4',
        labelWrapper: 'w-2/5',
        wrapper: 'flex items-center mb-2'
    },
    stacked: {
        helper: 'text-gray-500 text-xs italic',
        inputWrapper: '',
        label: 'block text-gray-600 dark:text-gray-400 my-1',
        labelWrapper: '',
        wrapper: 'w-full mb-2'
    },
    onlyInput: {
        helper: 'text-gray-500 text-xs italic',
        inputWrapper: '',
        label: '',
        labelWrapper: '',
        wrapper: 'mb-2'
    }
};

export function FieldWrapper({ name, classNames = {}, placeholder, error, label, helper, children, layout = 'inline', inputId }: FieldWrapperProps) {
    // @ts-ignore
    defaults(classNames, DEFAULT_CLASSNAMES[layout]);

    if (layout === 'inline') {
        return (
            <div className={clsx(classNames.wrapper, {
                'field-error': error
            })}>
                <div className={clsx(classNames.labelWrapper)}>
                    <label className={clsx(classNames.label)} htmlFor={inputId}>
                        {label || placeholder || name}
                    </label>
                </div>
                <div className={clsx(classNames.inputWrapper)}>
                    {children}
                </div>
            </div>
        );
    }

    if (layout === 'stacked') {
        return (
            <div className={clsx(classNames.wrapper,{
                'field-error': error
            })}>
                <label className={clsx(classNames.label)} htmlFor={inputId}>
                    {label || placeholder || name}
                </label>
                {children}
                <p className={clsx(classNames.helper)}>{error?.message || error || helper}</p>
            </div>
        );
    }

    return (
        <div className={clsx(classNames.wrapper,{
            'field-error': error
        })}>
            {children}
            <p className={clsx(classNames.helper)}>{error?.message || error || helper}</p>
        </div>
    );
}
