import { TabElementsProps } from "../../types/tabs/TabsTypes";
import { getDataStoreKeys } from "../commons/dataStore/getDataStoreKeys";

function useGetTabsElements() {
    const { assessment } = getDataStoreKeys()

    const tabsElements: TabElementsProps[] =  assessment?.tabGroups?.map((option) => ({
        name: option.label,
        value: option.label,
    })) ?? []


    return { tabsElements }
}

export { useGetTabsElements }