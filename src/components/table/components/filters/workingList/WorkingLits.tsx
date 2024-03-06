import React, { useState } from 'react'
import WithPadding from '../../../../template/WithPadding'
import { Chip, IconUserGroup16, IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import DropdownButtonComponent from '../../../../buttons/DropdownButton';
import ModalComponent from '../../../../modal/Modal';
import ModalContentComponent from '../../../../modal/ModalContent';
import { type ButtonActionProps } from '../../../../../types/buttons/ButtonActions';
import EnrollmentActionsButtons from '../../enrollmentButtons/EnrollmentActionsButtons';

function WorkingLits() {
  const [open, setOpen] = useState<boolean>(false);

  const modalActions: ButtonActionProps[] = [
    { label: "Close", disabled: false, onClick: () => { setOpen(false) } },
    { label: "Save and add new", primary: true, disabled: false, onClick: () => { setOpen(false) } },
    { label: "Save and close", primary: true, disabled: false, onClick: () => { setOpen(false) } }
  ];

  return (
    <WithPadding>
      <div className='d-flex justify-content-between'>
        <div />

        <EnrollmentActionsButtons />

      </div>
    </WithPadding>
  )
}

export default WorkingLits
