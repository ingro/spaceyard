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
            if (column.hidden) {
                return true;
            }

            if (selectedColumns.includes(column.accessorKey)) {
                return false;
            }
    
            return true;
        });

        return hiddenColumnsConfig.map((column: any) => column.accessorKey);
    }, [columnsConfig, selectedColumns]);
 
    return {
        selectedColumns,
        hiddenColumns,
        setSelectedColumns
    };
}
