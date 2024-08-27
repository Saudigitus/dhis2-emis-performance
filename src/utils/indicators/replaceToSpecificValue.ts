export function replaceToSpecificValue(rows: any, condition: string) {

    for (const row of Object.keys(rows)) {
        if (condition.includes(row.trim())) {
            condition = condition.replaceAll(row.trim(), rows[row]);
        }
    }

    return condition;
}
