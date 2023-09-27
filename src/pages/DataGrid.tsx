import { useMemo, useState } from 'react';
import { CreateEditableTableCell, TanTable, useTable, useUrlSyncedDataTableStateV8 } from '@ingruz/tabulisk';
import { createColumnHelper } from '@tanstack/react-table';
import find from 'lodash/find';
import intersection from 'lodash/intersection';

import { TableFilterDropdown } from '../../lib/components/TableFilterDropdown';
import { TableConfigModal } from '../../lib/components/TableConfigModal';
import { ActiveFiltersList } from '../../lib/components/ActiveFiltersList';
import { Drawer } from '../../lib/components/Drawer';
import { Select } from '../../lib/components/Select';
import { useColumnsSelector, useDisclosure, useEditDrawer } from '../../lib/hooks';
import { updateFilterValue } from '../../lib/utilities/filters';
// import useUrlSyncedDataTableState from '../utils/useUrlSyncedDataTableState';

type Character = {
    id: number;
    name: string;
    city: string;
    age: number;
    gender: 'F' | 'M';
    last_access: string;
}

const updateDataAsync = (data: any, setData: any, id: any, columnId: string, value: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const record = find(data, { id });

            if (record) {
                // @ts-ignore
                record[columnId] = value;

                setData([].concat(...data));
    
                resolve({
                    ...record,
                    [columnId]: value,
                });
            }
        }, 2000);
    });
};

const baseData: Array<Character> = [
    {
        id: 1,
        name: 'Topolino',
        city: 'Topolinia',
        age: 25,
        gender: 'M',
        last_access: '2023-09-01'
    },
    {
        id: 2,
        name: 'Paperino',
        city: 'Paperopoli',
        age: 32,
        gender: 'M',
        last_access: '2023-09-05'
    },
    {
        id: 3,
        name: 'Paperina',
        city: 'Paperopoli',
        age: 29,
        gender: 'F',
        last_access: '2023-09-01'
    },
    {
        id: 4,
        name: 'Paperon De Paperoni',
        city: 'Paperopoli',
        age: 99,
        gender: 'M',
        last_access: '2023-09-05'
    },
    {
        id: 5,
        name: 'Pippo',
        city: 'Topolinia',
        age: 30,
        gender: 'M',
        last_access: '2023-09-01'
    },
    {
        id: 6,
        name: 'Minnie',
        city: 'Topolinia',
        age: 22,
        gender: 'F',
        last_access: '2023-09-05'
    }
];

export default function DataGrid() {
    const [data, setData] = useState(baseData);
    const m = useDisclosure();

    const { isOpenEditSide, openEditSide, closeEditSide, currentItemEditId } = useEditDrawer();

    const columnHelper = createColumnHelper<Character>();

    const columns = useMemo(() => {
        return [
            columnHelper.display({
                id: 'actions',
                header: 'Azioni',
                meta: {
                    protected: true
                },
                cell: ({ row }: any) => {
                    return (
                        <button
                            className={`btn btn-sm`}
                            onClick={() => openEditSide(row.original.id)}
                        >
                            Detail
                        </button>
                    );
                }
            }),
            columnHelper.accessor('id', {
                header: 'ID'
            }),
            columnHelper.accessor('name', {
                header: 'Nome',
                meta: {
                    filterEl: (props: any) => {
                        // console.warn(props);
    
                        return (
                            <TableFilterDropdown 
                                {...props}
                                filterControl="search"
                                filterProps={{ placeholder: 'Filter by name' }}
                            />
                        );
                    }
                }
            }),
            columnHelper.accessor('age', {
                header: 'Età',
                meta: {
                    hidden: true
                }
            }),
            columnHelper.accessor('city', {
                header: 'Città',
                // @ts-ignore
                cell: CreateEditableTableCell('id', 'disabled:bg-gray-600')
            }),
            columnHelper.accessor('last_access', {
                header: 'Ultimo accesso',
                meta: {
                    filterEl: (props: any) => (
                        <TableFilterDropdown
                            {...props}
                            filterControl='date'
                        />
                    )
                }
            }),
            columnHelper.accessor('gender', {
                meta: {
                    virtual: true
                }
            })
        ];
    }, [openEditSide]);

    // console.log(columns);

    // const selectedColumnsState = useState(columns.map(column => column.accessorKey));
    const preSelectedColumns = ['actions', 'id', 'name', 'city', 'last_access'];

    // Non è molto elegante ma se utilizzo la selezione righe o l'espansione allora devo prependere le colonne a quelle selezionate
    /* @ts-ignore */
    const selectedColumnsState = useState([].concat(['select', 'expand']).concat(...preSelectedColumns));

    const { selectedColumns, hiddenColumns, setSelectedColumns } = useColumnsSelector(columns, selectedColumnsState);

    const defaultState = {};
    const notQsDefaultState = {
        columnOrder: selectedColumns,
        columnVisibility: hiddenColumns.reduce((obj: any, id) => { 
            obj[id] = false; 
            return obj;}
        , {})
    }

    const tableConfig = useMemo(() => {
        return {
            sorting: true,
            paginate: true,
            showPageSizeSelector: true,
            enableExpanding: true,
            enableHiding: true,
            enableRowSelection: true,
            renderExpandedRow: ({ row }: any) => (<div><h1>{row.original.name}</h1></div>),
            meta: {
                updateData(id: any, columnId: string, value: any) {
                    return updateDataAsync(data, setData, id, columnId, value);
                }
            }
        };
    }, []);

    const table = useTable({
        data,
        columns,
        config: tableConfig
    });

    useUrlSyncedDataTableStateV8(table, defaultState, notQsDefaultState);

    function getFilterValueForId(id: string, defaultValue: any): any {
        return find(table.getState().columnFilters, { id })?.value || defaultValue;
    }

    // console.log(table);

    return (
        <>
            {m.isOpen && (
                <TableConfigModal 
                    onClose={m.close}
                    name="Config Table"
                    currentColumns={selectedColumns}
                    columnConfig={columns}
                    updateSelectedColumns={setSelectedColumns}
                    table={table}
                />
            )}
            <div>
                <div className='grid grid-cols-4 gap-x-4'>
                    <div>
                        <Select 
                            placeholder='Filter by gender'
                            options={[
                                { value: 'F', label: 'Female'},
                                { value: 'M', label: 'Male'},
                            ]}
                            value={getFilterValueForId('gender', null)}
                            onChange={(e: any) => {
                                table.setColumnFilters(updateFilterValue('gender', e?.value || null));
                            }}
                            showClearBtn={true}
                        />
                    </div>
                    <div>
                        <button onClick={m.open}>Configura</button>
                    </div>
                    <div>
                    <button onClick={() => {
                        // @ts-ignore
                        const currentPaginationRows = table.getPaginationRowModel().flatRows.map(r => r.original.id);
                        // @ts-ignore
                        const selectedRows = Object.values(table.getFilteredSelectedRowModel().rowsById).map(r => r.original.id);

                        alert(intersection(selectedRows, currentPaginationRows));
                    }}>
                        Get current selected rows
                    </button>
                    </div>
                </div>
                <div>
                    <ActiveFiltersList 
                        table={table}
                    />
                </div>
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
