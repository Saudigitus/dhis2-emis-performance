import React, { useState } from "react";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import styles from './HeaderFilters.module.css'
import { useHeader } from "../../../../hooks";
import { useRecoilState } from "recoil";
import { TableColumnState } from "../../../../schema/columnSchema";
import { Button, IconAdd16 } from '@dhis2/ui';
import { RowSelectorState } from "../../../../schema/rowSelectorSchema";
import { ModalComponent } from "../../../modal";
import ModalEdit from "../../../modal/ModalUpdateDataElements";
import { NoticeBox } from '@dhis2/ui';

function HeaderFilters(props: any) {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState)
  let [selectedRows,] = useRecoilState(RowSelectorState)
  const [open, setOpen] = useState(false)

  const setTableHeaders = (tableHeaders: any) => setTableColumns(tableHeaders)

  return (
    <div className={styles.filterContainer}>
      <EnrollmentFilters />

      <div className={styles.filterLeftContainer}>
        {/* <RowActions row={{}}/> */}
        {/* <SwitchButtonView /> */}
        {/* <EnrollmentActionsButtons/> */}
        {
          Object.keys(selectedRows).length > 0 && <NoticeBox className={styles.noticeBox} title={`${Object.keys(selectedRows).length} ASCA(S) selecionada(s)`} />
        }
        <Button disabled={Object.keys(selectedRows).length === 0} onClick={() => { setOpen(!open) }} icon={<IconAdd16 />}>
          <span className={styles.work_buttons_text}>Atribuir Treinador</span>
        </Button>

        <ConfigTableColumns filteredHeaders={updatedCols} headers={columns} updateVariables={setTableHeaders} />
      </div>
      {open && <ModalComponent title={`Actualização da data e do nome do formador`} open={open} setOpen={setOpen}>
        <ModalEdit setOpen={setOpen} tableData={props?.tableData} />
      </ModalComponent>}
    </div>
  );
}

export default HeaderFilters;
