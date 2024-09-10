import React from "react";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import styles from './HeaderFilters.module.css'
import { useHeader } from "../../../../hooks";
import { useRecoilState } from "recoil";
import { TableColumnState } from "../../../../schema/columnSchema";
import { Button, IconAdd16 } from '@dhis2/ui';
import { RowSelectorState } from "../../../../schema/rowSelectorSchema";

function HeaderFilters() {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState)
  let [selectedRows,] = useRecoilState(RowSelectorState)

  const setTableHeaders = (tableHeaders: any) => setTableColumns(tableHeaders)

  return (
    <div className={styles.filterContainer}>
      <EnrollmentFilters />

      <div className={styles.filterLeftContainer}>
        {/* <RowActions row={{}}/> */}
        {/* <SwitchButtonView /> */}
        {/* <EnrollmentActionsButtons/> */}
        <Button disabled={Object.keys(selectedRows).length === 0} onClick={() => { }} icon={<IconAdd16 />}>
          <span className={styles.work_buttons_text}>Atribuir Treinador</span>
        </Button>

        <ConfigTableColumns filteredHeaders={updatedCols} headers={columns} updateVariables={setTableHeaders} />
      </div>
    </div>
  );
}

export default HeaderFilters;
