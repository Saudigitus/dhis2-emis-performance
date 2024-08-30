import React from 'react'
import { IconUserGroup16, ButtonStrip, Button, IconCheckmarkCircle16, IconDownload16 } from "@dhis2/ui";
import DropdownButtonComponent from '../../../buttons/DropdownButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams } from '../../../../hooks';
import { FlyoutOptionsProps } from '../../../../types/buttons/FlyoutOptionsProps';
import ButtonComponent from '../../../buttons/Button';
import { useRecoilValue } from 'recoil';
import { SubTabState } from '../../../../schema/termMarksSchema';
import { useCompleteEvents } from '../../../../hooks/events/useCompleteEvents';
import { useDownloadData } from '../../../../hooks/export/useDownloadData';

function EnrollmentActionsButtons() {
  const { urlParamiters } = useParams();
  const { school: orgUnit } = urlParamiters();
  const selectedTerm = useRecoilValue(SubTabState)
  const { completeEvents, loading: completing } = useCompleteEvents()
  const { downloadData, downloading } = useDownloadData()

  const dropdownOptions: FlyoutOptionsProps[] = [
    { label: "Import studentss", divider: true, onClick: () => { alert("Import students"); } },
    { label: "Export template with data", divider: false, onClick: () => { alert("Export template with data"); } }
  ];

  return (
    <div>
      <ButtonStrip>
        {/* <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
        <span className='bulk-performance__hide'>
          <DropdownButtonComponent
            name="Bulk Performance"
            icon={<IconUserGroup16 />}
            options={dropdownOptions}
          />
          </span>
        </Tooltip> */}
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
      </ButtonStrip>
    </div>
  )
}

export default EnrollmentActionsButtons
