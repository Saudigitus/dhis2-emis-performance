import style from './rowActions.module.css'
import { IconEdit24, IconDelete24, Button, IconCheckmarkCircle24, IconDownload24 } from "@dhis2/ui";
import { IconButton, Tooltip } from '@material-ui/core';
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';
import { CancelOutlined } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { DataStoreState } from '../../../../schema/dataStoreSchema';
import { TabsState } from '../../../../schema/tabSchema';

export default function RowActions(props: RowActionsProps) {
  const { row } = props;
  const selectedTab = useRecoilValue(TabsState)
  const dataStore = useRecoilValue(DataStoreState)

  const nextAction = dataStore[0].assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.nextAction

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
      onClick: () => { },
    }
  ];

  return (
    <div className={style.rowActionsContainer}>
      {rowsActions.map((option: RowActionsType, i: number) => (
        <>
          {
            option.label ?
            <Button>
              {option.label}
            </Button>
            : null
          }
        </>
        // <Tooltip
        //   key={i}
        //   title={option.label}
        //   disabled={option?.disabled}
        //   onClick={() => { option.onClick() }}
        // >
        //   <IconButton style={{ color: option.color }} className={style.rowActionsIcon}>{option.icon}</IconButton>
        // </Tooltip>
      ))}
    </div>
  );
}
