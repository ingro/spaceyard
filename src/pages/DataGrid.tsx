import { useMemo, useState } from 'react';
import { TanTable, useTable } from '@ingruz/tabulisk';

import { TableFilterDropdown } from '../../lib/components/TableFilterDropdown';
import { TableConfigModal } from '../../lib/components/TableConfigModal';
import { Drawer } from '../../lib/components/Drawer';
import { useColumnsSelector, useDisclosure, useEditDrawer } from '../../lib/hooks';

const data = [
    {
        id: 1,
        name: 'Topolino',
        city: 'Topolinia',
        age: 25
    },
    {
        id: 2,
        name: 'Paperino',
        city: 'Paperopoli',
        age: 32
    },
    {
        id: 3,
        name: 'Paperon De Paperoni',
        city: 'Paperopoli',
        age: 99
    },
    {
        id: 4,
        name: 'Pippo',
        city: 'Topolinia',
        age: 30
    },
];

export default function DataGrid() {
    // const reducer = useUrlSyncedDataTableState({
    //     filters: {
    //         name: ''
    //     }
    // });

    const m = useDisclosure();

    const { isOpenEditSide, openEditSide, closeEditSide, currentItemEditId } = useEditDrawer();

    const columns = useMemo(() => {
        return [
            {
                header: 'Azioni',
                accessorKey: 'id',
                enableSorting: false,
                columnConfig: {
                    protected: true
                },
                cell: ({ cell }: any) => {
                    return (
                        <button
                            className={`btn btn-sm`}
                            onClick={() => openEditSide(cell.getValue())}
                        >
                            Detail
                        </button>
                    );
                }
            },
            {
                header: 'Nome',
                accessorKey: 'name',
                Filter: (props: any) => (
                    <TableFilterDropdown 
                        {...props}
                        filterControl="search"
                    />
                )
            },
            {
                header: 'Eta',
                accessorKey: 'age'
            },
            {
                header: 'Città',
                accessorKey: 'city'
            },
        ];
    }, [openEditSide]);

    // const selectedColumnsState = useState(columns.map(column => column.accessor));
    const selectedColumnsState = useState(['id', 'name']);

    const { selectedColumns, hiddenColumns, setSelectedColumns } = useColumnsSelector(columns, selectedColumnsState);

    console.warn(hiddenColumns);

    const tableConfig = useMemo(() => {
        return {
            sorting: true,
            paginate: true,
            showPageSizeSelector: true,
            enableHiding: true,
            // useReducer: reducer,
            hiddenColumns
        };
    }, []);

    const table = useTable({
        data,
        columns,
        config: tableConfig
    });

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
                <TanTable 
                    table={table}
                    config={tableConfig}
                />
                <Drawer 
                    isOpen={isOpenEditSide} 
                    onClose={closeEditSide}
                    dismissable={true}
                >
                    <div>DETAIL #{currentItemEditId}</div>
                </Drawer>
            </div>
        </>
    );
}
