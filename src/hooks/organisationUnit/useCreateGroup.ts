import { useState } from 'react'
import { useDataEngine } from "@dhis2/app-runtime"
import useShowAlerts from '../commons/useShowAlert';
import useCreateTracker from '../tei/useCreateTracker';
import useAddOrgUnitToProgram from './useAddOrgUnitToProgram';
import { useGenerateUsers } from '../users/useGenerateUsers';
import { useSetRecoilState } from 'recoil';
import { TeiRefetch } from '../../schema/refecthTeiSchema';
import useAddOrgUnitToDataSet from '../dataSets/useAddOrgUnitToDataSet';
import { postTrackerBody } from '../../utils/tracker/formatDataForPost';
import { useFormatDataStore } from '../dataStore/useFormatDataStore';


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
}

export default function useCreateGroup() {
    const engine = useDataEngine();
    const { hide, show } = useShowAlerts()
    const { createTracker } = useCreateTracker()
    const { addOuToProgram } = useAddOrgUnitToProgram()
    const [loading, setLoading] = useState<boolean>(false)
    const { createUser, generateUsers } = useGenerateUsers()
    const { addOuToDataSet } = useAddOrgUnitToDataSet()
    const setRefetch = useSetRecoilState(TeiRefetch)

    const { groupsAccess, groupsManagementProgram, groupsTEI, dataSet } = useFormatDataStore()

    const createGroup = async ({ data, formData, closeModal }: createGroupTypes) => {
        setLoading(true)

        await engine.mutate(POST_OU, { variables: { data } })
            .then(async (saveOuresponse: any) => {

                await addOuToProgram(groupsAccess, saveOuresponse?.response?.uid)
                    .then(async () => {

                        await addOuToDataSet([dataSet], saveOuresponse?.response?.uid).
                            then(async () => {
                                await createTracker({ data: postTrackerBody(formData, groupsManagementProgram, groupsTEI, saveOuresponse?.response?.uid) })
                                    .then(async () => {

                                        const currentUser = generateUsers(saveOuresponse?.response?.uid)
                                        await createUser({ username: currentUser.username, password: currentUser.password, groupId: saveOuresponse?.response?.uid })

                                            .then(() => {
                                                setLoading(false)
                                                closeModal()
                                                setRefetch(true)
                                            })
                                    });
                            })
                    })
            })


            .catch((error: any) => {
                show({
                    message: `Erro ao criar grupo: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
                setLoading(false)
            })
    }

    return { loading, createGroup }
}
