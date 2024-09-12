import { useDataEngine } from "@dhis2/app-runtime"

const DELETE_OU: any = {
    resource: "organisationUnits",
    type: 'delete',
    id: ({ id } : any) => id,
}
 
export default  function useDeleteOrgUnit () {
    const engine = useDataEngine();

    const deleteOrgUnit = async (id: string) => {
      return await engine.mutate(DELETE_OU, { variables: { id } })
    }

    return { deleteOrgUnit }
}
