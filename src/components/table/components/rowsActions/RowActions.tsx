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
import { Switch } from "@material-ui/core";
import { usePostEvent } from "../../../../hooks/events/useCreateEvents";
import { useParams } from "../../../../hooks";
import { getSelectedKey } from "../../../../utils";
import { format } from "date-fns";

export default function RowActions(props: RowActionsProps) {
  const { row, event,disabled } = props;
  const getProgram = useRecoilValue(ProgramConfigState);
  const { loadUpdateEvent, data, updateEvent } = usePostEvent()
  const { getDataStoreData } = getSelectedKey()
  const { urlParamiters } = useParams()
  const { moduloAdministrativo } = urlParamiters()
  const selected = getProgram?.programStages?.find(x => x.id === getDataStoreData.monitoria.programStage)?.programStageDataElements?.find(de => de.dataElement.id === getDataStoreData.monitoria.filters.dataElements[0].dataElement)?.dataElement

  function Changing() {
    const dateFormated = format(new Date(), "yyyy-MM-dd")

    const data: any = {
      events: [
        {
          trackedEntityInstance: row.trackedEntity,
          program: getProgram.id,
          programStage: getDataStoreData.monitoria.programStage,
          orgUnit: row.orgUnit,
          enrollment: row.enrollment,
          dataValues: [{
            dataElement: selected?.id,
            value: moduloAdministrativo
          }],
          eventDate: dateFormated,
          occurredAt: dateFormated
        }
      ]
    }
    void updateEvent({ data: data })
  }

  return (
    <div className={style.rowActionsContainer}>
      <Switch disabled={disabled} onChange={() => Changing()} checked={event ? true : false} color="primary" />
    </div>
  );
}
