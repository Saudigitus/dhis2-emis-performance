import style from './rowActions.module.css'
import { Button, IconCheckmarkCircle24 } from "@dhis2/ui";
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';
import { CancelOutlined } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { DataStoreState } from '../../../../schema/dataStoreSchema';
import { TabsState } from '../../../../schema/tabSchema';
import { ButtonGroup } from '../../../buttons/ButtonGroup';
import { useCompleteEvents } from '../../../../hooks/events/useCompleteEvents';

export default function RowActions(props: RowActionsProps) {
  const { row } = props;
  const selectedTab = useRecoilValue(TabsState)
  const dataStore = useRecoilValue(DataStoreState)
  const { completeEvents, loading: completing } = useCompleteEvents()
  const nextAction = dataStore[0].assessment?.tabGroups?.find((x) => x.programStage == selectedTab.programStage)?.nextAction

  const rowsActions: RowActionsType[] = [
    {
      icon: <CancelOutlined />,
      color: '#d64d4d',
      label: nextAction?.displayName!,
      disabled: false,
      onClick: () => { },
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
        <>
          {
            option.label ?
              <Button>
                {option.label}
              </Button>
              : null
          }
        </>
      ))}
    </div>
  );
}
