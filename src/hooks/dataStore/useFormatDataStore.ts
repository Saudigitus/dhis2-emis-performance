import { useRecoilState, useRecoilValue } from "recoil";
import { DataStoreState } from "../../schema/dataStoreSchema";
import { type programDataStoreType } from "../../schema/dataStoreSchema";


export function useFormatDataStore() {
    const dataStore = useRecoilValue(DataStoreState)
    const groupsProgram: programDataStoreType = dataStore[0]?.assessment?.programs.find((program: programDataStoreType) => program?.programName == 'groupsManagement')

    return {
        dataSet: dataStore[0]?.assessment?.files_id?.ficha,
        groupsLevel: dataStore[0]?.assessment?.groupsLevel,
        lastChildLevel: dataStore[0]?.assessment?.lastChildLevel,
        groupsAccess: dataStore[0]?.assessment?.programs.filter((program: programDataStoreType) => program?.accessTo == 'groups').map((element) => element?.program),
        groupsTEI: dataStore[0]?.assessment?.trackedEntityTypes.groups,
        groupsManagementProgram: groupsProgram,
    }
}