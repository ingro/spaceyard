import React from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { FiCheck, FiSettings } from 'react-icons/fi';
import find from 'lodash/find';

import { useAppContext } from '../hooks/useAppContext';
import { useDisclosure } from '../hooks/useDisclosure';
import { Modal, ModalBody, ModalFooter, ModalTitle } from './Modal';
import { SwitchFieldController } from './Switch';
import { SelectFieldController } from './Select';
import { CancelModalButton } from './Buttons';
import { DashboardWidgetConfig } from '../types';

type DashboardWidgetContainerProps = {
    children: any;
    widgetConfig: DashboardWidgetConfig;
};

type DashboardWidgetConfigModalProps = {
    onClose: () => void;
    widgetConfig: DashboardWidgetConfig,
    ErrorFallback?: React.ElementType
};

function DefaultErrorFallback({ error }: any) {
    return (
        <div>
            {error.message}
        </div>
    );
}

const sizes = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'X-Large'
};

function getSizeOptions() {
    return Object.entries(sizes).map(([key, value]) => {
        return {
            value: key,
            label: value
        };
    });
}

function DashboardWidgetConfigModal({ onClose, widgetConfig, ErrorFallback = DefaultErrorFallback }: DashboardWidgetConfigModalProps) {
    const { size, active, extras } = widgetConfig;
    const { appStorage } = useAppContext();
    
    const extraValues = extras.reduce((extras: Record<string, any>, extra) => {
        extras[extra.name] = extra.value;
        
        return extras;
    }, {});

    function onSubmit(data: any) {
        const dashboardConfig: Array<DashboardWidgetConfig> = appStorage.get('dashboardConfig');
        
        const widget = find(dashboardConfig, { code: widgetConfig.code });

        const { size, active, ...extras } = data;

        if (widget) {
            widget.size = size;
            widget.active = active;

            Object.keys(extras).forEach(name => {

                const extra: any = find(widget.extras, { name });

                if (extra) {
                    extra.value = extras[name];
                }
            })
        }

        appStorage.set('dashboardConfig', dashboardConfig);

        onClose();
    }

    const { control, handleSubmit } = useForm({
        defaultValues: {
            size,
            active,
            ...extraValues
        }
    });

    return (
        <Modal
            labelId="dashboard-config"
            onClose={onClose}
            dismissable={false}
            ErrorFallback={ErrorFallback}
        >
            <ModalTitle 
                onClose={onClose}
                labelId="dashboard-widget-config"
            >
                Configurazione "{widgetConfig.name}"
            </ModalTitle>
            <ModalBody>
                <div style={{ minHeight: '30vh' }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <SwitchFieldController
                            name="active"
                            // @ts-ignore
                            control={control}
                            label="Attivo"
                            labelPosition="none"
                            
                        />
                        <SelectFieldController
                            name="size"
                            // @ts-ignore
                            control={control}
                            label="Dimensione"
                            options={getSizeOptions()}
                            valueSelector={(option: any) => option.value}
                        />
                        {widgetConfig.extras.map(extra => {
                            if (extra.type === 'choice') {
                                return (
                                    <SelectFieldController 
                                        key={extra.name}
                                        name={extra.name}
                                        // @ts-ignore
                                        control={control}
                                        label={extra.label}
                                        options={extra.choices}
                                        valueSelector={(option: any) => option.value}
                                        dropdownFixed={true}
                                    />
                                );
                            }

                            return null;
                        })}
                    </form>
                </div>
            </ModalBody>
            <ModalFooter>
                <CancelModalButton onClose={onClose} />
                <button 
                    className="btn btn-lg btn-info ml-1"
                    onClick={handleSubmit(onSubmit)}
                >
                    <FiCheck /> Conferma
                </button>
            </ModalFooter>
        </Modal>
    );
}

export const DashboardWidgetContainer = React.forwardRef<any, DashboardWidgetContainerProps>(({ children, widgetConfig }, forwardRef) => {
    const { size } = widgetConfig;

    const { isOpen, close, open } = useDisclosure(false);

    return (
        <>
            {isOpen && (
                <DashboardWidgetConfigModal 
                    widgetConfig={widgetConfig} 
                    onClose={close}
                />
            )}
            <div 
                className={clsx('border border-gray-400 rounded-md relative', {
                    'lg:col-span-6 2xl:col-span-4': size === 'sm',
                    'lg:col-span-6': size === 'md',
                    'lg:col-span-8': size === 'lg',
                    'lg:col-span-12': size === 'xl',
                })} 
                style={{ minHeight: '600px' }}
                ref={forwardRef}
            >
                <div className="absolute top-0 right-1 hover:text-primary">
                    <button className="!outline-none" onClick={open} data-tooltip="Configurazione widget" data-tooltip-location="left"><FiSettings /></button>
                </div>
                {children}
            </div>
        </>
    );
});
