import { useState } from "react";
import { useExportData } from "./useExportData";
import useShowAlerts from "../commons/useShowAlert";
import { useHeader } from "../tableHeader/useHeader";
import { useTableData } from "../tableData/useTableData";

export function useDownloadData() {
    const generateExcel = useExportData();
    const { hide, show } = useShowAlerts()
    const { columns } = useHeader()
    const { getData, tableData } = useTableData()
    const [loading, setLoading] = useState<boolean>()

    async function downloadData(page: number, pageSize: number) {
        setLoading(true)
        
        await getData(page, pageSize, '', [])
            .then(() => {
                if (tableData)
                    generateExcel(
                        columns,
                        tableData,
                        `Excel name`
                    )
            })
            .catch((error: any) => {
                show({
                    message: `Could not get data: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return { downloadData, downloading: loading }
}