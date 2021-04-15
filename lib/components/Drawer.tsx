import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import Portal from "@reach/portal";
import { animated, useTransition } from 'react-spring';
import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';

import { CloseModalButton } from './Buttons';

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
    onOpened?: () => void;
    size?: 'small' | 'medium' | 'large';
    showOverlay?: boolean;
    side?: 'left' | 'right';
    ErrorFallback?: any;
};

export function Drawer({
    isOpen = false,
    className,
    onClose, 
    onOpened,
    children, 
    size = 'medium',
    side = 'right',
    dismissable = false,
    showOverlay = true,
    ErrorFallback = DefaultErrorFallback
}: DrawerProps) {
    const handleDismiss = dismissable ? onClose : () => {};

    const item = React.useMemo(() => {
        if (isOpen) {
            return [1];
        }

        return [];
    }, [isOpen]);

    const transitions = useTransition(item, {
        key: (item: any) => item,
        from: {
            opacity: 0,
            translateX: side === 'right' ? '100%' : '-100%'
        },
        enter: {
            opacity: 1,
            translateX: '0%'
        },
        leave: {
            opacity: 0, 
            translateX: side === 'right' ? '100%' : '-100%'
        },
        onRest() {
            if (item.length === 1 && onOpened) {
                onOpened();
            }
        },
        config: {}
    });

    const Wrapper = showOverlay ? AnimatedDialogOverlay : Portal;

    return (
        <>
            {transitions((props, item) => {
                return (
                    <Wrapper
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
                                <div className="absolute top-2 right-2">
                                    <CloseModalButton onClose={onClose} />
                                </div>
                            )}
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                {children}
                            </ErrorBoundary>
                        </AnimatedDialogContent>
                    </Wrapper>
                )
            })}
        </>
    );
}
