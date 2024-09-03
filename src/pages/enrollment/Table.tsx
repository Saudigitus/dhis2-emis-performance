import React, { useState } from "react";
import { ModalComponent, Table } from "../../components";
import { Fab } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { useParams } from "../../hooks";
import { getDataStoreKeys } from "../../utils";
import styles from './table.module.css'
import ModalContentAddGroups from "../../components/modal/ModalAddGroups";

//rgb(232, 245, 233)
function TableComponent() {
  const { urlParamiters } = useParams()
  const { orgUnitLevel, school } = urlParamiters()
  const { assessment } = getDataStoreKeys()
  const [open, setOpen] = useState(false);

  return (
    <>
      <Table />

      <Fab disabled={(orgUnitLevel !== null && assessment?.groupsLevel !== undefined && parseInt(orgUnitLevel) !== parseInt(assessment?.groupsLevel) - 1)} color='primary' className={styles['float-button__container']} onClick={() => { setOpen(true) }}>
        <AddIcon />
      </Fab>
      {
        open &&
        <ModalComponent title="Cadastro de Novo Grupo" open={open} setOpen={setOpen}>
          <ModalContentAddGroups setOpen={setOpen} parentId={school} />
        </ModalComponent>
      }
    </>
  )

}

export default TableComponent;
