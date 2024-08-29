import { usePostEvent } from "./useCreateEvents";

export const useChangeEventStatus = () => {
    const { loadUpdateEvent, updateEvent, data } = usePostEvent();


    async function changeEventStatus(status: string, eventss: any) {
        const events = []
        for (const event of eventss as any) {
            events.push({
                ...event,
                status: status,
            })
        }
        return void await updateEvent({ data: { events } })
    }

    return { changeEventStatus }
}