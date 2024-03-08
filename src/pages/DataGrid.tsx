import { useMemo, useState } from 'react';
import { CreateEditableTableCell, DataTable, useTable, useUrlSyncedDataTableState } from '@ingruz/tabulisk';
import { createColumnHelper } from '@tanstack/react-table';
import find from 'lodash/find';
import intersection from 'lodash/intersection';

import { TableFilterDropdown } from '../../lib/components/TableFilterDropdown';
import { TableConfigModal } from '../../lib/components/TableConfigModal';
import { ActiveFiltersList } from '../../lib/components/ActiveFiltersList';
import { Drawer } from '../../lib/components/Drawer';
import { Select } from '../../lib/components/Select';
import { useColumnsSelector, useDisclosure, useEditDrawer } from '../../lib/hooks';
// import useUrlSyncedDataTableState from '../utils/useUrlSyncedDataTableState';

type Character = {
    id: number;
    name: string;
    city: string;
    age: number;
    gender_id: 'F' | 'M';
    gender_name: 'Female' | 'Male';
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
        gender_id: 'M',
        gender_name: 'Male',
        last_access: '2023-09-01'
    },
    {
        id: 2,
        name: 'Paperino',
        city: 'Paperopoli',
        age: 32,
        gender_id: 'M',
        gender_name: 'Male',
        last_access: '2023-09-05'
    },
    {
        id: 3,
        name: 'Paperina',
        city: 'Paperopoli',
        age: 29,
        gender_id: 'F',
        gender_name: 'Female',
        last_access: '2023-09-01'
    },
    {
        id: 4,
        name: 'Paperon De Paperoni',
        city: 'Paperopoli',
        age: 99,
        gender_id: 'M',
        gender_name: 'Male',
        last_access: '2023-09-05'
    },
    {
        id: 5,
        name: 'Pippo',
        city: 'Topolinia',
        age: 30,
        gender_id: 'M',
        gender_name: 'Male',
        last_access: '2023-09-01'
    },
    {
        id: 6,
        name: 'Minnie',
        city: 'Topolinia',
        age: 22,
        gender_id: 'F',
        gender_name: 'Female',
        last_access: '2023-09-05'
    }
];

const defaultState = {};

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
                /*meta: {
                    protected: true
                },*/
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
                /*meta: {
                    hidden: true
                }*/
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
            columnHelper.accessor('gender_name', {
                header: 'Genere',
                meta: {
                    filterEl: (props: any) => {
                        const filterProps = {
                            options: [{ value: 'F', label: 'Female'}, { value: 'M', label: 'Male'}]
                        };

                        return (
                            <TableFilterDropdown 
                                {...props} 
                                filterKey="gender_id" 
                                filterControl='select' 
                                filterProps={filterProps} 
                            />
                        );
                    }
                }
            }),
            columnHelper.accessor('gender_id', {
                meta: {
                    virtual: true
                }
            })
        ];
    }, [openEditSide]);

    // console.log(columns);

    // @ts-ignore
    const selectedColumnsState = useState(columns.map(column => column.id || column.accessorKey));
    // const preSelectedColumns = ['tabulisk_select', 'tabulisk_expand', 'actions', 'id', 'name', 'city', 'last_access', 'gender_name'];

    // const selectedColumnsState = useState([]);

    const { selectedColumns, hiddenColumns, setSelectedColumns } = useColumnsSelector(columns, selectedColumnsState);

    const notQsDefaultState = useMemo(() =>{
        return {
            columnOrder: selectedColumns,
            columnVisibility: hiddenColumns.reduce((obj: any, id) => { 
                obj[id] = false; 
                return obj;}
            , {})
        }
    }, [selectedColumns, hiddenColumns]);

    const tableConfig = useMemo(() => {
        return {
            // manualSorting: true,
            // paginate: true,
            // showPageSizeSelector: true,
            // manualFiltering: false,
            // manualSorting: false,
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

    // console.warn(tableConfig);
    // console.warn(table.getState());

    useUrlSyncedDataTableState(table, defaultState, notQsDefaultState);

    /*function getFilterValueForId(id: string, defaultValue: any): any {
        return find(table.getState().columnFilters, { id })?.value || defaultValue;
    }*/

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
                            value={table.getColumn('gender_id')?.getFilterValue() || null}
                            onChange={(e: any) => {
                                table.getColumn('gender_id')?.setFilterValue(e?.value || null);
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
                <DataTable 
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
