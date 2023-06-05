import { useMemo } from 'react';

export function useColumnsSelector(columnsConfig: any, columnsState: any) {
    const [selectedColumns, setSelectedColumns] = columnsState;

    const hiddenColumns: any = useMemo(() => {
        const hiddenColumnsConfig = columnsConfig.filter((column: any) => {
            if (column.columnConfig && column.columnConfig.hidden) {
                return true;
            }

            if (selectedColumns.includes(column.id) || selectedColumns.includes(column.accessor)) {
                return false;
            }
    
            return true;
        });

        return hiddenColumnsConfig.map((column: any) => column.id || column.accessor);
    }, [columnsConfig, selectedColumns]);
 
    return {
        selectedColumns,
        hiddenColumns,
        setSelectedColumns
    };
}
