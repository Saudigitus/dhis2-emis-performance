import React, { useState } from 'react'
import { IconUserGroup16, IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import ModalComponent from '../../../modal/Modal';
import ModalContentComponent from '../../../modal/ModalContent';
import ImportContent from '../../../modal/ImportContent';
import DropdownButtonComponent from '../../../buttons/DropdownButton';
import Tooltip from '@material-ui/core/Tooltip';
import { FlyoutOptionsProps } from '../../../../types/buttons/FlyoutOptionsProps';
import { useParams } from '../../../../hooks';

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
          <span>
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
