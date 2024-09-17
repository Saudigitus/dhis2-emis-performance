import { useDataEngine, useDataMutation } from "@dhis2/app-runtime"

const USERQUERY: any = {
    resource: "users",
    type: "create",
    data: ({ data }: any) => data
}

interface createUserProps {
    username: string,
    password: string,
    groupId: string
}

export const useGenerateUsers = () => {
    const usernameBase = "g"
    const passwordStandart = "POUPAR"
    const engine = useDataEngine()

    function generateUsers(groupAutoGenerate: string) {
        const randomNumberUsername = Math.floor(Math.random() * 1000000)
        const randomNumber = Math.floor(Math.random() * 1000)

        const username = `${usernameBase}${randomNumberUsername}`
        const password = `${passwordStandart}${randomNumber}!`


        return {
            username,
            password
        }
    }

    async function createUser({ username, password, groupId }: createUserProps) {
        const user = {
            "surname": "Group",
            "username": username,
            "password": password,
            "firstName": "Template",
            "userRoles": [
                { "id": "MlSvfiNo0ZA" }
            ],
            "userGroups": [{ "id": "FjwzvXSzejS" }],
            "organisationUnits": [{ "id": groupId }],
            "dataViewOrganisationUnits": [{ "id": groupId }],
            "teiSearchOrganisationUnits": [{ "id": groupId }]
        }

        return await engine.mutate(USERQUERY, { variables: { data: user } })
    }

    return {
        generateUsers,
        createUser,
    }
}
