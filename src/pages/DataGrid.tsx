import { useMemo, useState } from 'react';
import { TanTable, useTable, useUrlSyncedDataTableStateV8 } from '@ingruz/tabulisk';
import find from 'lodash/find';

import { TableFilterDropdown } from '../../lib/components/TableFilterDropdown';
import { TableConfigModal } from '../../lib/components/TableConfigModal';
import { Drawer } from '../../lib/components/Drawer';
import { useColumnsSelector, useDisclosure, useEditDrawer } from '../../lib/hooks';
import { Select } from '../../lib/main';
// import useUrlSyncedDataTableState from '../utils/useUrlSyncedDataTableState';

const data = [
    {
        id: 1,
        name: 'Topolino',
        city: 'Topolinia',
        age: 25,
        gender: 'M'
    },
    {
        id: 2,
        name: 'Paperino',
        city: 'Paperopoli',
        age: 32,
        gender: 'M'
    },
    {
        id: 3,
        name: 'Paperina',
        city: 'Paperopoli',
        age: 29,
        gender: 'F'
    },
    {
        id: 4,
        name: 'Paperon De Paperoni',
        city: 'Paperopoli',
        age: 99,
        gender: 'M'
    },
    {
        id: 5,
        name: 'Pippo',
        city: 'Topolinia',
        age: 30,
        gender: 'M'
    },
    {
        id: 6,
        name: 'Minnie',
        city: 'Topolinia',
        age: 22,
        gender: 'F'
    }
];

export default function DataGrid() {
    const m = useDisclosure();

    const { isOpenEditSide, openEditSide, closeEditSide, currentItemEditId } = useEditDrawer();

    const columns = useMemo(() => {
        return [
            {
                header: 'Azioni',
                accessorKey: 'actions',
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
                header: 'ID',
                accessorKey: 'id'
            },
            {
                header: 'Nome',
                accessorKey: 'name',
                filterEl: (props: any) => (
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
            {
                accessorKey: 'gender',
                columnConfig: {
                    hidden: true
                }
            }
        ];
    }, [openEditSide]);

    // const selectedColumnsState = useState(columns.map(column => column.accessorKey));
    const selectedColumnsState = useState(['actions', 'id', 'name']);

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
            enableHiding: true
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

    function updateFilterValue(id: string, value: any): any {
        return (filters: any) => {
            const newArray = [].concat(...filters);
            const index = newArray.findIndex((obj: any) => obj.id === id);

            if (index !== -1) {
                // @ts-ignore
                newArray[index].value = value;
            } else {
                // @ts-ignore
                return newArray.concat({ id, value });
            }

            return newArray;
        }
    }

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
