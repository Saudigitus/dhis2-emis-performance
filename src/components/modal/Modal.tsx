import React from "react"
import { Modal, ModalTitle, ModalContent } from "@dhis2/ui"
import styles from "./modal.module.css"
import type { ModalProps } from "../../types/modal/ModalProps"
import { useRecoilValue } from "recoil"
import { ProgressState } from "../../schema/linearProgress"

function ModalComponent(props: ModalProps): React.ReactElement {
  const { open, setOpen, title, children } = props
  const progress = useRecoilValue(ProgressState)

  return (
    <Modal
      className={styles.modalContainer}
      open={open}
      position={"middle"}
      onClose={() => {
        setOpen(false)
      }}
    >
      {progress.progress == null && <ModalTitle>{title}</ModalTitle>}
      <ModalContent>{children}</ModalContent>
    </Modal>
  )
}

export default ModalComponent
