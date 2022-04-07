export function useColumnsSelector(columnsConfig: any, columnsState: any) {
    const [selectedColumns, setSelectedColumns] = columnsState;

    const hiddenColumns = columnsConfig.filter((column: any) => {
        if (selectedColumns.includes(column.id) || selectedColumns.includes(column.accessor)) {
            return false;
        }

        return true;
    });

    return {
        selectedColumns,
        hiddenColumns: hiddenColumns.map((column: any) => column.id || column.accessor),
        setSelectedColumns
    }
}
