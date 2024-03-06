import React from "react";
import styles from "./card.module.css";
import { SummaryCardProps } from "../../types/cards/SummaryCardProps";

export default function SummaryCard(props: SummaryCardProps): React.ReactElement {
  const { value, label, color } = props;

  return (
    <div className={styles[color]}>
      <div>
        <h5>{value}</h5>
        <span>{label}</span>
      </div>
    </div>
  );
}
