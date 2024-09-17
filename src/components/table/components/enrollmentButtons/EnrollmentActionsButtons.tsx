import React, { useState } from "react"
import { IconUserGroup16, ButtonStrip } from "@dhis2/ui"
import DropdownButtonComponent from "../../../buttons/DropdownButton"
import Tooltip from "@material-ui/core/Tooltip"
import { useParams } from "../../../../hooks"
import type { FlyoutOptionsProps } from "../../../../types/Buttons/FlyoutOptionsProps"
import styles from "./enrollmentActionsButtons.module.css"
import {
  ModalComponent,
  ModalContentComponent
} from "../../../../components"
import ModalExportTemplateContent from "../../../modal/ModalExportTemplateContent"
import {BulkMarksUpload} from "../../../bulkImport/BulkMarksUpload";

function EnrollmentActionsButtons() {
  const { urlParamiters } = useParams()
  const { school: orgUnit } = urlParamiters()
  const [openExportEmptyTemplate, setOpenExportEmptyTemplate] =
    useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [openImport, setOpenImport] = useState<boolean>(false)

  const enrollmentOptions: FlyoutOptionsProps[] = [
    {
      label: "Export students list",
      divider: false,
      onClick: () => {
        setOpenExportEmptyTemplate(true)
      }
    },
    {
      label: "Bulk marks upload",
      divider: true,
      onClick: () => {
        setOpenImport(true)
      }
    }
  ]

  return (
    <div>
      <ButtonStrip>
        <Tooltip
          title={
            orgUnit === null ? "Please select an organisation unit before" : ""
          }
        >
          <span>
            <DropdownButtonComponent
              name={
                (
                  <span className={styles.work_buttons_text}>
                    Bulk Performance
                  </span>
                ) as unknown as string
              }
              disabled={false}
              // disabled={!grade || !currentClass}
              icon={<IconUserGroup16 />}
              options={enrollmentOptions}
            />
          </span>
        </Tooltip>
      </ButtonStrip>
      {open && (
        <ModalComponent
          title="Bulk Student Final Result"
          open={open}
          setOpen={setOpen}
        >
          <ModalContentComponent setOpen={setOpen} />
        </ModalComponent>
      )}
      {openImport &&
          <BulkMarksUpload
            setOpen={setOpenImport}
            isOpen={openImport}
            forUpdate={false}
          />
      }
      {openExportEmptyTemplate && (
        <ModalComponent
          title={`Data Import Template Export`}
          open={openExportEmptyTemplate}
          setOpen={setOpenExportEmptyTemplate}
        >
          <ModalExportTemplateContent
            sectionName={""}
            setOpen={setOpenExportEmptyTemplate}
          />
        </ModalComponent>
      )}
    </div>
  )
}

export default EnrollmentActionsButtons
