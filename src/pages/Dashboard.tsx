import React from 'react';

import { DashboardPanel } from '../../lib/components/DashboardPanel';
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

export default function Dashboard() {
    return (
        <DashboardPanel
            appStorage={storage}
            // @ts-ignore
            widgetsList={widgetsList}
            getComponentFn={() => <span />}
            defaultWidgetMinHeight={300}
        >
            <h2>Dashboard</h2>
        </DashboardPanel>
    );
}