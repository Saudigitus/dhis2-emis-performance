import { useRecoilState, useSetRecoilState } from "recoil"
import { useShowAlerts } from "../../hooks"
import { useDataEngine, useDataMutation } from "@dhis2/app-runtime"
import { teiRefetch } from "../../schema/teiRefetchSchema"
import { type ApiResponse } from "../../types/bulkImport/Interfaces";
import { ProgressState } from "../../schema/linearProgress";
import { useState } from 'react'
import { TeiRefetch } from "../../schema/refecthTeiSchema";

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
  const engine = useDataEngine()
  const { hide, show } = useShowAlerts()
  const [refetch, setRefetch] = useRecoilState<boolean>(TeiRefetch)
  const updateProgress = useSetRecoilState(ProgressState)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(undefined)

  async function create(foundEvents: any, params: any) {
    setLoading(true)
    setData(undefined)
    await engine.mutate({
      resource: "/tracker",
      type: "create",
      data: foundEvents,
      params: {
        atomicMode: "OBJECT",
        reportMode: "FULL",
        ...params
      }
    })
      .then((response: any) => {
        setLoading(false)
        setData(response)

        if (params.importMode !== 'VALIDATE') {
          updateProgress({ progress: 100, buffer: 100 })
          show({
            message: "Enrollment data Updated Successfully",
            type: { success: true }
          })
          setTimeout(hide, 5000);
          setRefetch(!refetch)

          setTimeout(() => {
            updateProgress({ progress: null, buffer: null });
          }, 200);
        }
        
      })
      .catch(() => { })
  }



  // const [create, { loading, data, error }] = useDataMutation(POST_EVENT, {
  //   onComplete: () => {
  //     setProgress({ progress: null })
  //     show({
  //       message: "Final results updated successfully",
  //       type: { success: true }
  //     })
  //     setRefetch(!refetch)
  //   },
  //   onError: (error) => {
  //     setProgress({ progress: null })
  //     show({
  //       message: `Could not save the final result details: ${error.message}`,
  //       type: { critical: true }
  //     })
  //     setTimeout(hide, 5000)
  //   }
  // })

  return {
    loadUpdateEvent: loading,
    updateEvent: create,
    data: data as unknown as ApiResponse,
  }
}
