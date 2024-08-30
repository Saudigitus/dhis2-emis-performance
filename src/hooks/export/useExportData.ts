import Excel from 'exceljs'
import { useCallback } from 'react';
import { saveAs } from 'file-saver';

interface Header {
    header: string;
    key: string;
    width?: number;
}

interface Row {
    [key: string]: any;
}

export const useExportData = () => {
    const generateExcel = useCallback(async (headers: Header[], rows: Row[], fileName: string) => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Página");

        worksheet.columns = headers;
        worksheet.getRow(1).font = { name: 'Calibri', size: 12, bold: true}

        rows.forEach(row => worksheet.addRow(row));

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${fileName.replace(/\s/g, "")}.xlsx`);
    }, []);

    return generateExcel;
};