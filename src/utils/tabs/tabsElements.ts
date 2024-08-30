import { TabElementsProps } from "../../types/tabs/TabsTypes";
import { getDataStoreKeys } from "../commons/dataStore/getDataStoreKeys";

function useGetTabsElements() {
    const { assessment } = getDataStoreKeys()

    const tabsElements: TabElementsProps[] =  assessment?.tabGroups?.map((option) => ({
        order: option.order,
        name: option.label,
        value: option.label,
        programStage: option.programStage
    })) ?? []


    return { tabsElements }
}

export { useGetTabsElements }