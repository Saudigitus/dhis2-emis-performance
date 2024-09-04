import React from 'react'
import { IconUserGroup16, ButtonStrip, Button, IconCheckmarkCircle16, IconDownload16 } from "@dhis2/ui";
import DropdownButtonComponent from '../../../buttons/DropdownButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams } from '../../../../hooks';
import { FlyoutOptionsProps } from '../../../../types/buttons/FlyoutOptionsProps';
import ButtonComponent from '../../../buttons/Button';
import { useRecoilValue } from 'recoil';
import { IconCheckmarkCircle24 } from "@dhis2/ui";
import { CancelOutlined } from '@material-ui/icons';
import { SubTabState } from '../../../../schema/termMarksSchema';
import { useCompleteEvents } from '../../../../hooks/events/useCompleteEvents';
import { useDownloadData } from '../../../../hooks/export/useDownloadData';
import { ButtonGroup } from '../../../buttons/ButtonGroup';
import { AllTeisSchema } from '../../../../schema/allTeisSchema';
import { TableDataLoadingState } from '../../../../schema/tableDataLoadingSchema';

function EnrollmentActionsButtons() {
  const { urlParamiters } = useParams();
  const { orgUnit: orgUnit } = urlParamiters();
  const selectedTerm = useRecoilValue(SubTabState)
  const { completeEvents, loading: completing } = useCompleteEvents()
  const allTeis = useRecoilValue(AllTeisSchema)
  const { downloadData, downloading } = useDownloadData()
  const loading = useRecoilValue(TableDataLoadingState)

  const dropdownOptions: FlyoutOptionsProps[] = [
    { label: "Import studentss", divider: true, onClick: () => { alert("Import students"); } },
    { label: "Export template with data", divider: false, onClick: () => { alert("Export template with data"); } }
  ];

  const eventsActions = [
    {
      icon: <IconCheckmarkCircle24 />,
      color: '#277314',
      disabled: loading || completing,
      tooltip: 'Completar todos',
      onClick: () => { completeEvents("COMPLETED", allTeis) },
    },
    {
      icon: <CancelOutlined />,
      color: '#d64d4d',
      disabled: loading || completing,
      tooltip: 'Activar todos',
      onClick: () => { completeEvents("ACTIVE", allTeis) },
    }
  ]

  return (
    <div>
      <ButtonStrip>
        {/* <ButtonComponent
          secondary
          label='Download'
          loading={downloading}
          icon={<IconDownload16 />}
          onClick={() => { downloadData(1, 1) }}
          disabled={false || downloading}
        /> */}

        {/* <ButtonComponent
          primary
          label='Completar'
          loading={completing}
          icon={<IconCheckmarkCircle16 />}
          onClick={() => { completeEvents() }}
          disabled={!selectedTerm.hasProgramStage || completing}
        /> */}
        {/* <ButtonGroup buttons={eventsActions} /> */}
      </ButtonStrip>
    </div>
  )
}

export default EnrollmentActionsButtons
