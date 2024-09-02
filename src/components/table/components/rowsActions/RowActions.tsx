import { useState } from "react";
import style from './rowActions.module.css'
import { Button, IconCheckmarkCircle24 } from "@dhis2/ui";
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';
import { CancelOutlined } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { DataStoreState } from '../../../../schema/dataStoreSchema';
import { TabsState } from '../../../../schema/tabSchema';
import { ModalComponent, ModalContentProgramStages } from '../../../modal';
import { ProgramConfigState } from "../../../../schema/programSchema";
import { ButtonGroup } from '../../../buttons/ButtonGroup';
import { useCompleteEvents } from '../../../../hooks/events/useCompleteEvents';

export default function RowActions(props: RowActionsProps) {
  const { row } = props;
  const selectedTab = useRecoilValue(TabsState)
  const dataStore = useRecoilValue(DataStoreState)
  const getProgram = useRecoilValue(ProgramConfigState);
  const [openEditionModal, setOpenEditionModal] = useState<boolean>(false);
  const { completeEvents, loading: completing } = useCompleteEvents()
  const nextAction = dataStore[0].assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.nextAction
  const title = getProgram?.programStages?.filter((x: any) => x.id === nextAction?.programStage)?.[0]?.displayName || ""


  const rowsActions: RowActionsType[] = [
    {
      icon: <CancelOutlined />,
      color: '#d64d4d',
      label: nextAction?.displayName!,
      disabled: false,
      onClick: () => { setOpenEditionModal(!openEditionModal) },
    }
  ];

  const eventsActions = [
    {
      icon: <IconCheckmarkCircle24 />,
      color: '#277314',
      disabled: false,
      tooltip: 'Completar',
      onClick: () => { completeEvents("COMPLETED", [row?.trackedEntity]) },
    },
    {
      icon: <CancelOutlined />,
      color: '#d64d4d',
      disabled: false,
      tooltip: 'Activar',
      onClick: () => { completeEvents("ACTIVE", [row?.trackedEntity]) },
    }
  ]

  return (
    <div className={style.rowActionsContainer}>
      <ButtonGroup buttons={eventsActions} />

      {rowsActions.map((option: RowActionsType, i: number) => (
        option.label ?
          <Button onClick={() => { option.onClick() }} >
            {option.label}
          </Button>
          : null
      ))}

      {
        openEditionModal &&
        <ModalComponent title={title} open={openEditionModal} setOpen={setOpenEditionModal}>
          <ModalContentProgramStages open={openEditionModal} setOpen={setOpenEditionModal} nexProgramStage={nextAction?.programStage!} />
        </ModalComponent>
      }
    </div>
  );
}
