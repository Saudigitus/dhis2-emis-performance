import React, { useState } from "react";
import { ModalComponent, Table } from "../../components";
import { Fab } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { useParams } from "../../hooks";
import { getDataStoreKeys } from "../../utils";
import styles from './table.module.css'
import ModalContentAddGroups from "../../components/modal/ModalAddGroups";
import useGetGroupForm from "../../hooks/form/useGetGroupForm";
import { Tooltip } from "@material-ui/core";

function TableComponent() {
  const { urlParamiters } = useParams()
  const { orgUnitLevel, orgUnit } = urlParamiters()
  const { assessment } = getDataStoreKeys()
  const [open, setOpen] = useState(false);
  const { formData } = useGetGroupForm();

  
  return (
    <>
      <Table />

      <Fab disabled={(orgUnitLevel !== null && assessment?.groupsLevel !== undefined && parseInt(orgUnitLevel) !== parseInt(assessment?.groupsLevel) - 1)} color='primary' className={styles['float-button__container']} onClick={() => { setOpen(true) }}>
        <Tooltip title="Criar grupo">
          <AddIcon />
        </Tooltip>
      </Fab>
      {
        open &&
        <ModalComponent title="Cadastro de Novo Grupo" open={open} setOpen={setOpen}>
          <ModalContentAddGroups
            setOpen={setOpen}
            parentId={orgUnit}
            formData={formData}
          />
        </ModalComponent>
      }
    </>
  )

}

export default TableComponent;
