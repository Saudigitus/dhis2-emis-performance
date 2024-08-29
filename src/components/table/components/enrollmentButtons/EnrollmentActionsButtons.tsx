import React from 'react'
import { IconUserGroup16, ButtonStrip, Button, IconCheckmarkCircle16 } from "@dhis2/ui";
import DropdownButtonComponent from '../../../buttons/DropdownButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams } from '../../../../hooks';
import { FlyoutOptionsProps } from '../../../../types/buttons/FlyoutOptionsProps';
import ButtonComponent from '../../../buttons/Button';
import { useRecoilValue } from 'recoil';
import { SubTabState } from '../../../../schema/termMarksSchema';
import { useCompleteEvents } from '../../../../hooks/events/useCompleteEvents';

function EnrollmentActionsButtons() {
  const { urlParamiters } = useParams();
  const { school: orgUnit } = urlParamiters();
  const selectedTerm = useRecoilValue(SubTabState)
  const { completeEvents, loading } = useCompleteEvents()

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
        <ButtonComponent
          primary
          label='Completar'
          loading={loading}
          icon={<IconCheckmarkCircle16 />}
          onClick={() => { completeEvents() }}
          disabled={!selectedTerm.hasProgramStage || loading}
        />
      </ButtonStrip>
    </div>
  )
}

export default EnrollmentActionsButtons
