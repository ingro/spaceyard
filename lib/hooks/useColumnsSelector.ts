import { useMemo } from 'react';

type useColumnsSelectorOut = {
    selectedColumns: Array<string>;
    hiddenColumns: Array<string>;
    setSelectedColumns: any;
}

export function useColumnsSelector(columnsConfig: any, columnsState: any): useColumnsSelectorOut {
    const [selectedColumns, setSelectedColumns] = columnsState;

    const hiddenColumns: any = useMemo(() => {
        const hiddenColumnsConfig = columnsConfig.filter((column: any) => {
            if (column.meta?.protected) {
                return false;
            }

            if (column.meta?.hidden) {
                return true;
            }

            const columnAccessor = column.accessorKey || column.id;

            if (selectedColumns.includes(columnAccessor)) {
                return false;
            }
    
            return true;
        });

        return hiddenColumnsConfig.map((column: any) => column.accessorKey || column.id);
    }, [columnsConfig, selectedColumns]);
 
    return {
        selectedColumns,
        hiddenColumns,
        setSelectedColumns
    };
}
