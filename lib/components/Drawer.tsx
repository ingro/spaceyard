import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import Portal from "@reach/portal";
import { animated, useTransition } from 'react-spring';
import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';
import { FiX } from 'react-icons/fi';

const AnimatedDialogContent = animated(DialogContent);
const AnimatedDialogOverlay = animated(DialogOverlay);

function DefaultErrorFallback({ error }: any) {
    return (
        <div>
            {error.message}
        </div>
    );
}

type DrawerProps = {
    children: any;
    className?: string;
    isOpen?: boolean;
    dismissable?: boolean;
    onClose: () => void;
    size?: 'small' | 'medium' | 'large';
    showOverlay?: boolean;
    side?: 'left' | 'right';
    ErrorFallback?: any;
};

export function Drawer({
    isOpen = false,
    className,
    onClose, 
    children, 
    size = 'medium',
    side = 'right',
    dismissable = false,
    showOverlay = true,
    ErrorFallback = DefaultErrorFallback
}: DrawerProps) {
    const handleDismiss = dismissable ? onClose : () => {};

    const transitions = useTransition(isOpen, null, {
        from: {
            opacity: 0,
            transform: side === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
        },
        enter: {
            opacity: 1,
            transform: 'translateX(0)'
        },
        leave: {
            opacity: 0,
            transform: side === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
        },
        config: {
            //...config.stiff,
            // easing: easeBounceIn
        }
    });

    const Wrapper = showOverlay ? AnimatedDialogOverlay : Portal;

    return (
        <>
            {transitions.map(({ item, key, props }) =>
                item && (
                    <Wrapper
                        key={key}
                        as="div"
                        style={{
                            opacity: props.opacity
                        }}
                        className="z-20 lg:z-10"
                        isOpen={true} 
                        onDismiss={handleDismiss}
                    >
                        <AnimatedDialogContent
                            as="div"
                            className={clsx(
                                'outline-none fixed lg:top-0 top-16 h-screen max-h-screen p-2 dark:bg-gray-600 border border-gray-200 shadow-2xl',
                                className, 
                                {
                                    'right-0 rounded-l-lg rounded-r-none': side === 'right',
                                    'left-0 rounded-l-none rounded-r-lg': side === 'left',
                                    'w-11/12 md:w-1/3 lg:w-1/4 xl:w-1/6': size === 'small',
                                    'w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4': size === 'medium',
                                    'w-11/12 md:w-4/5 lg:w-2/4 xl:w-1/3': size === 'large',
                                }
                            )}
                            style={props}
                            aria-labelledby={`drawer-${side}-${size}`}
                            data-spaceyard-drawer-content
                        >
                            {dismissable && (
                                <div className="cursor-pointer dark:text-white absolute top-2 right-2" onClick={onClose}>
                                    <FiX className="w-6 h-6"/>
                                </div>
                            )}
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                {children}
                            </ErrorBoundary>
                        </AnimatedDialogContent>
                    </Wrapper>
                )
            )}
        </>
    );
}
