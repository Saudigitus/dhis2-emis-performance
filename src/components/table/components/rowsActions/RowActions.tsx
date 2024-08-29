import style from './rowActions.module.css'
import { IconEdit24, IconDelete24, Button, IconCheckmarkCircle24, IconDownload24 } from "@dhis2/ui";
import { IconButton, Tooltip } from '@material-ui/core';
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';


export default function RowActions(props: RowActionsProps) {
  const { row } = props;

  const rowsActions: RowActionsType[] = [
    {
      icon: <IconCheckmarkCircle24 />,
      color: '#277314',
      label: `Complete`,
      disabled: false,
      onClick: () => { },
    },
    {
      icon: <IconDownload24 />,
      color: '#d64d4d',
      label: `Delete`,
      disabled: false,
      onClick: () => { },
    }
  ];

  return (
    <div className={style.rowActionsContainer}>
      {rowsActions.map((option: RowActionsType, i: number) => (
        <Tooltip
          key={i}
          title={option.label}
          disabled={option?.disabled}
          onClick={() => { option.onClick() }}
        >
          <IconButton style={{ color: option.color }} className={style.rowActionsIcon}>{option.icon}</IconButton>
        </Tooltip>
      ))}
    </div>
  );
}
