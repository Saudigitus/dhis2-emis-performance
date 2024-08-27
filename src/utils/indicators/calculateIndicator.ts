import { removeCBDefaultAndDS } from "./removeCBDefaultAndDS";
import { removeUnnecessary } from "./removeUnnecessary";
import { replaceToSpecificValue } from "./replaceToSpecificValue";

export function calculateIndicator(row: any, column: {numerator: any, denominator: any}) {

    const rowCleaned = removeCBDefaultAndDS(row)
    const numerator = replaceToSpecificValue(rowCleaned, removeUnnecessary(column.numerator))
    const denominator = replaceToSpecificValue(rowCleaned, removeUnnecessary(column.denominator))

    try {
        if (eval(numerator) > -1) {
            return parseFloat(eval(numerator).toFixed(1))
        }
        return 0
    } catch (error) {
        return 0
    }
}
