import { useState } from 'react'
import { useDataEngine } from "@dhis2/app-runtime"
import useShowAlerts from '../commons/useShowAlert';
import useCreateTracker from '../tei/useCreateTracker';
import useAddOrgUnitToProgram from './useAddOrgUnitToProgram';
import { useGenerateUsers } from '../users/useGenerateUsers';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { TeiRefetch } from '../../schema/refecthTeiSchema';
import { postTrackerBody } from '../../utils/tracker/formatDataForPost';
import { useFormatDataStore } from '../dataStore/useFormatDataStore';
import useDeleteOrgUnit from './useDeleteOrgUnit';
import { TabsState } from '../../schema/tabSchema';


const POST_OU: any = {
    resource: "organisationUnits",
    type: 'create',
    data: ({ data }: any) => data,
    params: {
        async: false
    }
}

interface createGroupTypes {
    data: object,
    formData: any,
    closeModal: () => void,
    // refetch: any,
    fieldsWithValue: any[]
    values: any
}

export default function useCreateGroup() {
    const engine = useDataEngine();
    const { hide, show } = useShowAlerts()
    const { createTracker } = useCreateTracker()
    const { addOuToProgram } = useAddOrgUnitToProgram()
    const [loading, setLoading] = useState<boolean>(false)
    const { createUser, generateUsers } = useGenerateUsers()
    const setRefetch = useSetRecoilState(TeiRefetch)
    const { deleteOrgUnit } = useDeleteOrgUnit()
    const programStage = useRecoilValue(TabsState).programStage

    const { groupsAccess, groupsManagementProgram, groupsTEI } = useFormatDataStore()

    const createGroup = async ({ data, formData, closeModal, fieldsWithValue, values }: createGroupTypes) => {
        setLoading(true)

        try {
            const saveOrgUnitResponse: any = await engine.mutate(POST_OU, { variables: { data } })
            const currentUser = generateUsers(saveOrgUnitResponse?.response?.uid)

            try {
                const addOuResponse = await addOuToProgram(groupsAccess, saveOrgUnitResponse?.response?.uid)
                const createTrackerResponse = await createTracker({ data: postTrackerBody(formData, groupsManagementProgram, groupsTEI, saveOrgUnitResponse?.response?.uid, fieldsWithValue, values, programStage) })
                const createUserResponse = await createUser({ username: currentUser.username, password: currentUser.password, groupId: saveOrgUnitResponse?.response?.uid })

                setRefetch(true)
            } catch (error: any) {
                show({
                    message: `Erro ao criar grupo: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
                deleteOrgUnit(saveOrgUnitResponse?.response?.uid)
            }
        }
        catch (error: any) {
            show({
                message: `Erro ao criar grupo: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }

        finally {
            setLoading(false)
            closeModal()
        }

    }

    return { loading, createGroup }
}
