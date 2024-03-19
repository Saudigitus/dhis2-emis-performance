import React from 'react'
import { IconUserGroup16, ButtonStrip } from "@dhis2/ui";
import DropdownButtonComponent from '../../../buttons/DropdownButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useParams } from '../../../../hooks';
import { FlyoutOptionsProps } from '../../../../types/Buttons/FlyoutOptionsProps';

function EnrollmentActionsButtons() {
  const { urlParamiters } = useParams();
  const { school: orgUnit } = urlParamiters();

  const dropdownOptions: FlyoutOptionsProps[] = [
    { label: "Import studentss", divider: true, onClick: () => { alert("Import students"); } },
    { label: "Export template with data", divider: false, onClick: () => { alert("Export template with data"); } }
  ];

  return (
    <div>
      <ButtonStrip>
        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span className='bulk-performance__hide'>
            <DropdownButtonComponent
              name="Bulk Performance"
              icon={<IconUserGroup16 />}
              options={dropdownOptions}
            />
          </span>
        </Tooltip>
      </ButtonStrip>
    </div>
  )
}

export default EnrollmentActionsButtons
