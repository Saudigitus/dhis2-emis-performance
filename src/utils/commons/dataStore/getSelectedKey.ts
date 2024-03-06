import { useRecoilValue } from "recoil";
import { DataStoreState } from "../../../schema/dataStoreSchema"
import { useParams } from "../../../hooks";
import { dataStoreRecord } from "../../../types/dataStore/DataStoreConfig";

export const getSelectedKey = () => {
    const { urlParamiters } = useParams()
    const { sectionType } = urlParamiters()
    const emisConfig = useRecoilValue(DataStoreState);

    const getDataStoreData: dataStoreRecord = emisConfig?.length > 0
        ? emisConfig?.find(
            (dataStore: dataStoreRecord) => dataStore.key === sectionType
        ) ?? {} as unknown as dataStoreRecord
        : {} as unknown as dataStoreRecord

    return { getDataStoreData }
}
