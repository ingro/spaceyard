import React, { useMemo, useState } from 'react';
import { DataTable, useUrlSyncedDataTableState } from '@ingruz/tabulisk';

import { TableFilterDropdown } from '../../lib/components/TableFilterDropdown';
import { TableConfigModal } from '../../lib/components/TableConfigModal';
import { useColumnsSelector, useDisclosure } from '../../lib/hooks';

const data = [
    {
        id: 1,
        name: 'Foo',
        city: 'Topolinia'
    },
    {
        id: 2,
        name: 'Bar',
        city: 'Paperopoli'
    }
];

const columns = [
    {
        Header: 'Identificativo',
        accessor: 'id',
        id: 'id'
    },
    {
        Header: 'Nome',
        accessor: 'name',
        id: 'name',
        Filter: (props: any) => (
            <TableFilterDropdown 
                {...props}
                filterControl="search"
            />
        )
    },
    {
        Header: 'Città',
        accessor: 'city',
        id: 'city'
    },
];

export default function DataGrid() {
    const reducer = useUrlSyncedDataTableState({
        filters: {
            name: ''
        }
    });

    const m = useDisclosure();

    const selectedColumnsState = useState(columns.map(column => column.accessor));

    const { selectedColumns, hiddenColumns, setSelectedColumns } = useColumnsSelector(columns, selectedColumnsState);

    const tableConfig = useMemo(() => {
        return {
            useReducer: reducer,
            hiddenColumns
        };
    }, [selectedColumns, reducer]);

    return (
        <>
            {m.isOpen && (
                <TableConfigModal 
                    onClose={m.close}
                    name="Config Table"
                    currentColumns={selectedColumns}
                    columnConfig={columns}
                    updateSelectedColumns={setSelectedColumns}
                />
            )}
            <div>
                <button onClick={m.open}>Configura</button>
                <DataTable 
                    data={data}
                    columns={columns}
                    config={tableConfig}
                />
            </div>
        </>
    );
}
