import { atom } from "recoil";
import { TabElementsProps } from "../types/tabs/TabsTypes";

export const TabListSchema = atom<TabElementsProps[]>({
    key: "tab-list-schemma",
    default: []
})
