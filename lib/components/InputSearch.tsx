import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { easeBounceIn } from 'd3-ease';
import clsx from 'clsx';

import { useInputFocusKey } from '../hooks/hotkeyHooks';
import { ClearBtn } from './shared/dropdown';

type InputSearchProps = {
    autoComplete?: string;
    focusKey?: string | boolean; // 'Control+K'
    name?: string;
    onClear?: () => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
    showIcon?: boolean;
    value?: any;
};

export const InputSearch = React.forwardRef<any, InputSearchProps>(({ placeholder = 'Cerca...', onSubmit, onClear, value = '', focusKey = false, name, showIcon = true, ...rest }, forwardedRef) => {
    const [inputValue, setInputValue] = useState(value ? String(value) : '');
    const [hasFocus, setHasFocus] = useState(false);

    const localRef = useRef(null)
    const ref = forwardedRef ? forwardedRef : localRef;

    useEffect(() => {
        setInputValue(value ? String(value) : '');
    }, [value]);

    useInputFocusKey(focusKey ? ref : null, typeof focusKey === 'boolean' ? 'none' : focusKey);

    const clearValue = (typeof onClear === 'function') ? onClear : () => onSubmit('');

    const style = useSpring({
        width: hasFocus ? 2 : 32,
        opacity: hasFocus ? 0 : 1,
        config: {
            // tension: 600, 
            friction: 30,
            frequency: 0.1,
            damping: 0.9,
            easing: easeBounceIn
        }
    });

    return (
        <div className={clsx('flex flex-nowrap items-stretch m-0 relative py-1 pl-2 pr-1 form-input focus-within:!border-primary focus-within:bg-gray-100', {
            'form-element-has-value': value && value !== ''
        })}>
            {showIcon && (
                <animated.div style={{ width: style.width }} className="flex flex-col justify-center cursor-text text-center">
                    <animated.svg style={{ opacity: style.opacity }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></animated.svg>
                </animated.div>
            )}
            <input
                className={clsx('text-base appearance-none border-none bg-transparent focus:ring-0 focus:outline-none placeholder-gray-400 overflow-hidden min-w-0 flex-1 m-0 p-0')}
                name={name}
                placeholder={placeholder}
                onBlur={() => setHasFocus(false)}
                onFocus={() => setHasFocus(true)}
                value={inputValue}
                ref={ref}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        // @ts-ignore
                        onSubmit(e.target.value);
                    }

                    if (e.key === 'Escape') {
                        setInputValue('');
                        clearValue();
                    }
                }}
                role="searchbox"
                {...rest}
            />
            {value && value !== '' &&
                <ClearBtn
                    onClick={() => clearValue()}
                />
            }
        </div>
    );
});
