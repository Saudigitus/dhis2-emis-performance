import React from "react";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import SwitchButtonView from "../../../buttons/MultipleButtons/SwitchButtonView";
import styles from './HeaderFilters.module.css'
import { useHeader } from "../../../../hooks";

function HeaderFilters() {
  const { columns } = useHeader();
  return (
    <div className={styles.filterContainer}>
      <EnrollmentFilters />

      <div className={styles.filterLeftContainer}>
        <SwitchButtonView />
        <ConfigTableColumns headers={columns} updateVariables={() => {}} />
      </div>
    </div>
  );
}

export default HeaderFilters;
