import { eventStatus } from "../../../types/variables/AttributeColumns";

export function checkCompleted(status: string): boolean {
    return eventStatus.COMPLETED === status
}
