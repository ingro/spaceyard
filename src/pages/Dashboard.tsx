import React from 'react';
import clsx from 'clsx';

import { DashboardPanel } from '../../lib/components/DashboardPanel';
import { DashboardWidgetContainer } from '../../lib/main';
import { createAppStorage } from '../../lib/utilities/storage';

const storage = createAppStorage('spaceyard');

const widgetsList = {
    statsWidget: {
        name: 'Statistiche XYZ',
        minHeight: 400,
        extras: []
    },
    LastRequestWidget: {
        name: 'Ultime richieste',
        extras: [
            {
                name: 'rows_number',
                label: 'Numero righe',
                type: 'choice',
                value: '10',
                choices: [
                    {
                        label: '10',
                        value: '10'
                    },
                    {
                        label: '20',
                        value: '20'
                    }
                ]
            },
            {
                name: 'refetch_interval',
                label: 'Intervallo di aggiornamento (secondi)',
                type: 'choice',
                value: '120',
                choices: [
                    {
                        label: '30',
                        value: '30'
                    },
                    {
                        label: '60',
                        value: '60'
                    },
                    {
                        label: '120',
                        value: '120'
                    },
                    {
                        label: '300',
                        value: '300'
                    }
                ]
            }
        ]
    },
    ExportErrorByDateWidget: { 
        name: 'Errori export per data',
        extras: []
    },
    ExportErrorByProviderWidget: {
        name: 'Errori export per tipo',
        extras: []
    }
};

const bgColors = {
    statsWidget: 'bg-green-400',
    LastRequestWidget: 'bg-red-400',
    ExportErrorByDateWidget: 'bg-violet-400',
    ExportErrorByProviderWidget: 'bg-blue-400'
};

function DummyPanel({ widgetConfig }: any) {
    return (
        <DashboardWidgetContainer widgetConfig={widgetConfig}>
            {/* @ts-ignore */}
            <div className={clsx('h-full flex items-center text-center', bgColors[widgetConfig.code])}>
                <div className="grow">{widgetConfig.code}</div>
            </div>
        </DashboardWidgetContainer>
    );
}

export default function Dashboard() {
    return (
        <DashboardPanel
            appStorage={storage}
            // @ts-ignore
            widgetsList={widgetsList}
            getComponentFn={() => DummyPanel}
            defaultWidgetMinHeight={300}
        >
            <h2>Dashboard</h2>
        </DashboardPanel>
    );
}