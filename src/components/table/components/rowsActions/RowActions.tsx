import style from './rowActions.module.css'
import { RowActionsProps } from '../../../../types/table/TableContentProps';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ProgramConfigState } from "../../../../schema/programSchema";
import { Switch } from "@material-ui/core";
import { usePostEvent } from "../../../../hooks/events/useCreateEvents";
import { useParams } from "../../../../hooks";
import { getSelectedKey } from "../../../../utils";
import { format } from "date-fns";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import { ConfirmationState } from '../../../../schema/confirmationDialog';
import { IconButton } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

export default function RowActions(props: RowActionsProps) {
  const { row, event, completed, complete } = props;
  const getProgram = useRecoilValue(ProgramConfigState);
  const { updateEvent } = usePostEvent()
  const { getDataStoreData } = getSelectedKey()
  const { urlParamiters } = useParams()
  const { moduloAdministrativo } = urlParamiters()
  const selected = getProgram?.programStages?.find(x => x.id === getDataStoreData.monitoria.programStage)?.programStageDataElements?.find(de => de.dataElement.id === getDataStoreData.monitoria?.filters?.dataElements[0].dataElement)?.dataElement
  const [confirmSate, setConfirmState] = useRecoilState(ConfirmationState)
  const disabled = event?.event ? false : true

  function Changing(changeEvent: any) {
    if (changeEvent.target.checked) {
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
      setConfirmState({ open: false, event: event?.event, tei: row.trackedEntity, loading: true })
    } else {
      setConfirmState({ open: true, event: event?.event, tei: row.trackedEntity })
    }
  }

  function completeEvent(status: string) {
    const data: any = {
      events: [
        {
          ...event,
          status: status
        }
      ]
    }
    void updateEvent({ data: data })
    setConfirmState({ open: false, event: event?.event, tei: row.trackedEntity, loadingComplete: true })
  }

  return (
    <div className={style.rowActionsContainer}>
      <CenteredContent>
        {
          complete ?
            confirmSate.loadingComplete && confirmSate.tei === row.trackedEntity ?
              <CircularLoader small /> :
              completed ?
                <IconButton disabled={disabled} onClick={() => { completeEvent('ACTIVE') }} >
                  <CloseIcon style={{ color: disabled ? "#eee" : "red" }} />
                </IconButton>
                :
                <IconButton disabled={disabled} onClick={() => { completeEvent('COMPLETED') }} >
                  <CheckIcon style={{ color: disabled ? "#eee" : "green" }} />
                </IconButton>
            :
            confirmSate.loading && confirmSate.tei === row.trackedEntity ?
              <CircularLoader small /> :
              <Switch disabled={completed} onChange={(event: any) => Changing(event)} checked={event ? true : false} color="primary" />
        }
      </CenteredContent>
    </div>
  );
}
