import { useRecoilState, useSetRecoilState } from "recoil"
import { useShowAlerts } from "../../hooks"
import { useDataMutation } from "@dhis2/app-runtime"
import { teiRefetch } from "../../schema/teiRefetchSchema"
import { type ApiResponse } from "../../types/bulkImport/Interfaces";
import { ProgressState } from "../../schema/linearProgress";

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
  const setProgress = useSetRecoilState(ProgressState)

  const [create, { loading, data, error }] = useDataMutation(POST_EVENT, {
    onComplete: () => {
      setProgress({ progress: null })
      show({
        message: "Final results updated successfully",
        type: { success: true }
      })
      setRefetch(!refetch)
    },
    onError: (error) => {
      setProgress({ progress: null })
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
