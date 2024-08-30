import React from "react";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import SwitchButtonView from "../../../buttons/MultipleButtons/SwitchButtonView";
import styles from './HeaderFilters.module.css'
import { useHeader } from "../../../../hooks";
import { useRecoilState } from "recoil";
import { TableColumnState } from "../../../../schema/columnSchema";
import EnrollmentActionsButtons from "../enrollmentButtons/EnrollmentActionsButtons";

function HeaderFilters() {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState)
  
  const setTableHeaders = (tableHeaders: any) => setTableColumns(tableHeaders)
  
  return (
    <div className={styles.filterContainer}>
      <EnrollmentFilters />

      <div className={styles.filterLeftContainer}>
        <SwitchButtonView />
        <EnrollmentActionsButtons/>
        <ConfigTableColumns filteredHeaders={updatedCols} headers={columns} updateVariables={setTableHeaders} />
      </div>
    </div>
  );
}

export default HeaderFilters;
