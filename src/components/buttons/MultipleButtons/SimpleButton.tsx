import React from "react";
import styles from "../button.module.css";
import { ButtonStrip } from "@dhis2/ui";
import { type SimpleButtonsProps } from "../../../types/Buttons/SimpleButtonsProps";
import { useParams } from "../../../hooks/commons/useQueryParams";

interface ButtonProps {
  items: SimpleButtonsProps[]
  selectedTerm: any
  setSelectedTerm: (arg: any) => void
}

export default function SimpleButton(props: ButtonProps): React.ReactElement {
  const { items, selectedTerm, setSelectedTerm } = props;
  const { add } = useParams();

  return (
    <ButtonStrip>
      {items?.map((item) => (
        <div key={item?.id} className={selectedTerm?.id === item?.id
          ? styles["active-button"]
          : styles.simpleButton} onClick={() => {
            if (selectedTerm?.id !== item?.id) {
              setSelectedTerm(item);
              add("programStage", item.id)
            }
          }}>
          <span className={styles.simpleButtonLabel}>{item?.label}</span>
        </div>
      ))}
    </ButtonStrip>
  );
}
