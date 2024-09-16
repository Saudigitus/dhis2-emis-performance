import React from "react"
import styles from "../button.module.css"
import { ButtonStrip } from "@dhis2/ui"
import type {
  SimpleButtonsComponentProps,
  SimpleButtonsType
} from "../../../types/buttons/SimpleButtonsProps"
import { useParams } from "../../../hooks"

export default function SimpleButton(
  props: SimpleButtonsComponentProps
): React.ReactElement {
  const { items, selectedTerm, setSelectedTerm } = props
  const { add } = useParams()

  const handleSelectTerm = (item: SimpleButtonsType) => {
    if (selectedTerm?.id !== item?.id) {
      setSelectedTerm(item)
      add("programStage", item.id)
    }
  }

  return (
    <ButtonStrip>
      {items?.map((item) => (
        <div
          key={item?.id}
          className={
            selectedTerm?.id === item?.id
              ? styles["active-button"]
              : styles.simpleButton
          }
          onClick={() => handleSelectTerm(item)}
        >
          <span className={styles.simpleButtonLabel}>{item?.label}</span>
        </div>
      ))}
    </ButtonStrip>
  )
}
