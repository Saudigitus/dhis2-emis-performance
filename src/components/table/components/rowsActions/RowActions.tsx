import { useState } from "react";
import style from './rowActions.module.css'
import { IconEdit24, IconDelete24, Button, IconCheckmarkCircle24, IconDownload24 } from "@dhis2/ui";
import { IconButton, Tooltip } from '@material-ui/core';
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';
import { CancelOutlined } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { DataStoreState } from '../../../../schema/dataStoreSchema';
import { TabsState } from '../../../../schema/tabSchema';
import { ModalComponent, ModalContentProgramStages } from '../../../modal';
import { ProgramConfigState } from "../../../../schema/programSchema";

export default function RowActions(props: RowActionsProps) {
  const { row } = props;
  const selectedTab = useRecoilValue(TabsState)
  const dataStore = useRecoilValue(DataStoreState)
  const getProgram = useRecoilValue(ProgramConfigState);
  const [openEditionModal, setOpenEditionModal] = useState<boolean>(false);
  const nextAction = dataStore[0].assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.nextAction
  const title = getProgram?.programStages?.filter((x: any) => x.id === nextAction?.programStage)?.[0]?.displayName || ""


  const rowsActions: RowActionsType[] = [
    {
      icon: <IconCheckmarkCircle24 />,
      color: '#277314',
      label: `Completar`,
      disabled: false,
      onClick: () => { },
    },
    {
      icon: <CancelOutlined />,
      color: '#d64d4d',
      label: nextAction?.displayName!,
      disabled: false,
      onClick: () => { setOpenEditionModal(!openEditionModal) },
    }
  ];

  return (
    <div className={style.rowActionsContainer}>
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
