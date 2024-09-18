import { useRecoilState } from "recoil"
import { useShowAlerts } from "../../hooks"
import { useDataMutation } from "@dhis2/app-runtime"
import { teiRefetch } from "../../schema/teiRefetchSchema"
import {type ApiResponse} from "../../types/bulkImport/Interfaces";

const POST_EVENT: any = {
  resource: "tracker",
  type: "create",
  data: ({ data }: any) => data,
  params: {
    importStrategy: "UPDATE",
    async: false
  }
}

export function usePostEvent() {
  const { hide, show } = useShowAlerts()
  const [refetch, setRefetch] = useRecoilState<boolean>(teiRefetch)

  const [create, { loading, data, error }] = useDataMutation(POST_EVENT, {
    onComplete: () => {
      show({
        message: "Final results updated successfully",
        type: { success: true }
      })
      setRefetch(!refetch)
    },
    onError: (error) => {
      show({
        message: `Could not save the final result details: ${error.message}`,
        type: { critical: true }
      })
      setTimeout(hide, 5000)
    }
  })

  return {
    loadUpdateEvent: loading,
    updateEvent: create,
    data: data as unknown as ApiResponse,
    error
  }
}
