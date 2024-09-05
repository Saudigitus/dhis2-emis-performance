import style from './rowActions.module.css'
import { RowActionsProps } from '../../../../types/table/TableContentProps';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ProgramConfigState } from "../../../../schema/programSchema";
import { Switch } from "@material-ui/core";
import { usePostEvent } from "../../../../hooks/events/useCreateEvents";
import { useParams } from "../../../../hooks";
import { getSelectedKey } from "../../../../utils";
import { format } from "date-fns";
import { useDeleteEvent } from "../../../../hooks/events/useDeleteEvents";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import { useGetEvents } from '../../../../hooks/events/useGetEvents';
import { ConfirmationState } from '../../../../schema/confirmationDialog';

export default function RowActions(props: RowActionsProps) {
  const { row, event, disabled } = props;
  const getProgram = useRecoilValue(ProgramConfigState);
  const { updateEvent } = usePostEvent()
  const { getDataStoreData } = getSelectedKey()
  const { urlParamiters } = useParams()
  const { moduloAdministrativo } = urlParamiters()
  const selected = getProgram?.programStages?.find(x => x.id === getDataStoreData.monitoria.programStage)?.programStageDataElements?.find(de => de.dataElement.id === getDataStoreData.monitoria?.filters?.dataElements[0].dataElement)?.dataElement
  const [confirmSate, setConfirmState] = useRecoilState(ConfirmationState)

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
      setConfirmState({ open: false, event: event, tei: row.trackedEntity, loading: true })
    } else {
      setConfirmState({ open: true, event: event, tei: row.trackedEntity })
    }
  }

  return (
    <div className={style.rowActionsContainer}>
      {
        (confirmSate.loading && confirmSate.tei === row.trackedEntity) ?
          <CenteredContent>
            <CircularLoader small />
          </CenteredContent>
          :
          <CenteredContent>
            <Switch disabled={disabled} onChange={(event: any) => Changing(event)} checked={event ? true : false} color="primary" />
          </CenteredContent>
      }
    </div>
  );
}
