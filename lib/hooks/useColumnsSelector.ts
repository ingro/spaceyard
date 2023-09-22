import { useMemo } from 'react';

export function useColumnsSelector(columnsConfig: any, columnsState: any) {
    const [selectedColumns, setSelectedColumns] = columnsState;

    const hiddenColumns: any = useMemo(() => {
        const hiddenColumnsConfig = columnsConfig.filter((column: any) => {
            if (column.enableHiding) {
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
