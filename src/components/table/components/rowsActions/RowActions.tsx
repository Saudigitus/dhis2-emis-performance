import { useState, useEffect } from "react";
import style from './rowActions.module.css'
import { Button, IconCheckmarkCircle24 } from "@dhis2/ui";
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';
import { CancelOutlined } from '@material-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DataStoreState } from '../../../../schema/dataStoreSchema';
import { TabsState } from '../../../../schema/tabSchema';
import { ModalComponent, ModalContentProgramStages } from '../../../modal';
import { ProgramConfigState } from "../../../../schema/programSchema";
import { useCompleteEvents } from '../../../../hooks/events/useCompleteEvents';
import { checkCompleted } from "../../../../utils/table/rows/checkCanceled";
import { UpdatingEventState } from "../../../../schema/updateEventSchema";
import { useGetEventUpdateFormData } from "../../../../hooks/form/useGetEventUpdateFormData";
import Actions from "./Actions";

export default function RowActions(props: RowActionsProps) {
  const { row } = props;
  const selectedTab = useRecoilValue(TabsState)
  const dataStore = useRecoilValue(DataStoreState)
  const getProgram = useRecoilValue(ProgramConfigState);
  const [openEditionModal, setOpenEditionModal] = useState<boolean>(false);
  const [actionPStage, setActionPStage] = useState<string>();
  const { completeEvents, loading: completing } = useCompleteEvents()
  const [loadingRow, setLoadingRow] = useRecoilState(UpdatingEventState)
  const nextAction = dataStore[0].assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.nextAction
  const title = getProgram?.programStages?.filter((x: any) => x.id === actionPStage)?.[0]?.displayName || ""
  const eventsIsCompleted = checkCompleted(row?.eventStatus as string)
  const { buildFormData, error, loading, initialValues, setInitialValues } = useGetEventUpdateFormData()

  useEffect(() => {
    if (error)
      setOpenEditionModal(false)
  }, [error])

  useEffect(() => {
    if (!openEditionModal)
      setInitialValues({})
  }, [openEditionModal])

  const menuItems: RowActionsType[] = [
    {
      icon: eventsIsCompleted ? <CancelOutlined /> : <IconCheckmarkCircle24 />,
      color: eventsIsCompleted ? '#277314' : '#d64d4d',
      disabled: completing,
      loading: loadingRow?.event === row?.event,
      label: eventsIsCompleted ? 'Activar' : 'Completar',
      onClick: () => {
        setLoadingRow({ event: row?.event, loading: true })
        completeEvents(eventsIsCompleted ? "ACTIVE" : "COMPLETED", [row?.trackedEntity])
      },
    },
    ...nextAction?.map((action) => ({
      icon: <CancelOutlined />,
      color: '#d64d4d',
      label: action?.displayName,
      disabled: completing,
      onClick: () => {
        setOpenEditionModal(!openEditionModal)
        buildFormData(row?.trackedEntity, action?.programStage!)
        setActionPStage(action.programStage)
      },
    })) || [],
  ];


  return (
    <div className={style.rowActionsContainer}>
      <Actions menuItems={menuItems}/>

      {
        openEditionModal &&
        <ModalComponent title={title} open={openEditionModal} setOpen={setOpenEditionModal}>
          <ModalContentProgramStages
            open={openEditionModal}
            setOpen={setOpenEditionModal}
            nexProgramStage={actionPStage as string}
            loading={loading}
            formInitialValues={initialValues}
            row={row}
            mapping={dataStore[0].mappingVariables}
          />
        </ModalComponent>
      }
    </div>
  );
}
