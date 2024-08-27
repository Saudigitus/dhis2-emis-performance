export function removeCBDefaultAndDS(row: any) {

    const localRows : any = row;
    const newRows : any = {};

    for (const localRow of Object.keys(localRows)) {
        const params = localRow.split(".");
        if (params.length > 0) {
            if (newRows.hasOwnProperty(params[0])) {
                newRows[`${params[0]}`] = newRows[`${params[0]}`] + localRows[localRow];
            } else {
                newRows[`${params[0]}`] = localRows[localRow];
            }
        }
    }
    return newRows;
}
