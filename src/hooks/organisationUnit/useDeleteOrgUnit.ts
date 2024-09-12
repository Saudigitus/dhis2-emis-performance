import { useDataEngine } from "@dhis2/app-runtime"

const DELETE_OU: any = {
  resource: "organisationUnits",
  type: 'delete',
  id: ({ id }: any) => id,
}

const DELETE_OU_METADATA: any = {
  resource: "maintenance",
  type: 'create',
  params: {
    softDeletedDataValueRemoval: true,
    softDeletedEventRemoval: true,
    softDeletedEnrollmentRemoval: true,
    softDeletedTrackedEntityInstanceRemoval: true,
  }
}


export default function useDeleteOrgUnit() {
  const engine = useDataEngine();



  const deleteOrgUnit = async (id: string) => {
    await engine.mutate(DELETE_OU_METADATA)
    return await engine.mutate(DELETE_OU, { variables: { id } })
  }

  return { deleteOrgUnit }
}
