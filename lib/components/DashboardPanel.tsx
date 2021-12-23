import React, { Suspense, useMemo } from 'react';
import { FiSettings } from 'react-icons/fi';

import { DashboardConfigModal } from './DashboardConfigModal';
import { useDisclosure } from '../hooks/useDisclosure';
import { DashboardWidgetConfigStatic } from '../types';

type DashboardPanelProps = {
    appStorage: any,
    children: any,
    widgetsList: Record<string, DashboardWidgetConfigStatic>,
    getComponentFn: (code: string) => any
};

export function DashboardPanel({ appStorage, children, widgetsList, getComponentFn }: DashboardPanelProps) {
    const { open, close, isOpen } = useDisclosure();

    const [widgetConfig, setWidgetConfig] = appStorage.useLocalStorage('dashboardConfig', [], true);

    const widgets = useMemo(() => {
        return widgetConfig.map((config: any) => {
            return {
                ...config,
                Component: getComponentFn(config.code)
            };
        });
    }, [widgetConfig]);

    return (
        <>
            {isOpen && (
                <DashboardConfigModal 
                    widgetConfig={widgetConfig} 
                    widgetsList={widgetsList}
                    updateConfig={setWidgetConfig} 
                    onClose={close}
                />
            )}
            <main className="mt-2 lg:mt-">
                <div className="text-center">
                    {children}
                    <div className="absolute top-0 right-0 mt-3 mr-8">
                        <button 
                            className="btn btn-link btn-icon z-10 bg-white py-2" 
                            onClick={open}
                            data-tooltip="Configurazione dashboard"
                            data-tooltip-location="left"
                        >
                            <FiSettings style={{ display: 'block' }}/>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 xl:gap-4 my-2">
                        <Suspense fallback={null}>
                            {widgets.filter((widget: any) => widget.active).map(({ Component, ...rest }: any, i: number) => {
                                return <Component key={i} widgetConfig={rest} />
                            })}
                        </Suspense>
                    </div>
                </div>
            </main>
        </>
    );
}
