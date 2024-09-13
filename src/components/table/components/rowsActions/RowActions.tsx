import { useState, useEffect } from "react";
import style from './rowActions.module.css'
import { Button, IconCheckmarkCircle24 } from "@dhis2/ui";
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';
import { AddCircleOutline, Assignment, CancelOutlined, Edit, Gavel, History, Pages } from '@material-ui/icons';
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
import { useGetNextActions } from "../../../../hooks/programStages/useGetNextActions";
import { useNavigate } from "react-router-dom";

export default function RowActions(props: RowActionsProps) {
  const { row, inactive } = props;
  const navigate = useNavigate()
  const dataStore = useRecoilValue(DataStoreState)
  const getProgram = useRecoilValue(ProgramConfigState);
  const [openEditionModal, setOpenEditionModal] = useState<boolean>(false);
  const [actionPStage, setActionPStage] = useState<string>();
  const title = getProgram?.programStages?.filter((x: any) => x.id === actionPStage)?.[0]?.displayName || ""
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
      icon: <AddCircleOutline />,
      color: '#d64d4d',
      label: "Registar Financiamento",
      disabled: false,
      onClick: () => {
        setOpenEditionModal(!openEditionModal)
        setActionPStage(dataStore[0].financiamento?.programStage!)
      },
    },
    {
      icon: <History />,
      color: '#d64d4d',
      label: "Histórico de Financiamentos",
      disabled: false,
      onClick: () => {
        navigate("/history")
      },
    },
    {
      icon: <Assignment />,
      color: '#d64d4d',
      disabled: !row?.event,
      label: 'Visualizar Último Financiamento',
      onClick: () => {
        setOpenEditionModal(!openEditionModal)
        buildFormData(row?.trackedEntity, dataStore[0].financiamento?.programStage!!)
        setActionPStage(dataStore[0].financiamento?.programStage!)
      },
    },
  ];

  return (
    <div>
      <Actions inactive={inactive} menuItems={menuItems} completing={false} />
      {
        openEditionModal &&
        <ModalComponent title={title} open={openEditionModal} setOpen={setOpenEditionModal}>
          <ModalContentProgramStages
            open={openEditionModal}
            setOpen={setOpenEditionModal}
            nexProgramStage={actionPStage as string}
            loading={loading}
            formInitialValues={{
              ...initialValues,
              "nomeAsca": row[dataStore[0].mappingVariables.nomeAsca]
            }}
            row={row}
            mapping={dataStore[0].mappingVariables}
          />
        </ModalComponent>
      }
    </div>
  );
}
