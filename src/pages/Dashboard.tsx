import React from 'react';
import clsx from 'clsx';

import { DashboardPanel } from '../../lib/components/DashboardPanel';
import { DashboardWidgetContainer } from '../../lib/main';
import { createAppStorage } from '../../lib/utilities/storage';

const storage = createAppStorage('spaceyard');

const widgetsList = {
    xyzWidget: {
        name: 'XYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZ',
        minHeight: 400,
        extras: []
    },
    abcWidget: {
        name: 'ABC',
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
    wasdWidget: { 
        name: 'WASDWASDWASDWASDWASDWASDWASDWASDWASDWASD',
        extras: []
    },
    qwertyWidget: {
        name: 'QWERTY QWERTY QWERTY QWERTY QWERTY QWERTY',
        extras: []
    }
};

const bgColors = {
    xyzWidget: 'bg-green-400',
    abcWidget: 'bg-red-400',
    wasdWidget: 'bg-violet-400',
    qwertyWidget: 'bg-blue-400'
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