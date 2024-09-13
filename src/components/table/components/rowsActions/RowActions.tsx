import { useState, useEffect } from "react";
import { RowActionsProps, RowActionsType } from '../../../../types/table/TableContentProps';
import { AddCircleOutline, Assignment, History } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { DataStoreState } from '../../../../schema/dataStoreSchema';
import { ModalComponent, ModalContentProgramStages } from '../../../modal';
import { ProgramConfigState } from "../../../../schema/programSchema";
import { useGetEventUpdateFormData } from "../../../../hooks/form/useGetEventUpdateFormData";
import Actions from "./Actions";
import { useNavigate } from "react-router-dom";
import { useParams } from "../../../../hooks";

export default function RowActions(props: RowActionsProps) {
  const { row, inactive, editOption } = props;
  const { urlParamiters } = useParams()
  const { orgUnitName } = urlParamiters()
  const navigate = useNavigate()
  const dataStore = useRecoilValue(DataStoreState)
  const getProgram = useRecoilValue(ProgramConfigState);
  const [openEditionModal, setOpenEditionModal] = useState<boolean>(false);
  const [actionPStage, setActionPStage] = useState<string>();
  const title = getProgram?.programStages?.filter((x: any) => x.id === actionPStage)?.[0]?.displayName || ""
  const { buildFormData, error, loading, initialValues, setInitialValues } = useGetEventUpdateFormData()

  useEffect(() => {
    if (error)
      setOpenEditionModal(false)
  }, [error])

  useEffect(() => {
    if (!openEditionModal)
      setInitialValues({})
  }, [openEditionModal])

  const menuItems: RowActionsType[] = [
    {
      icon: <AddCircleOutline />,
      color: '#d64d4d',
      label: "Registar Financiamento",
      disabled: false,
      onClick: () => {
        setOpenEditionModal(!openEditionModal)
        setActionPStage(dataStore[0].financiamento?.programStage!)
      },
    },
    {
      icon: <History />,
      color: '#d64d4d',
      label: "Histórico de Financiamentos",
      disabled: row?.totalFinancimanetos > 0 ? false : true,
      onClick: () => {
        navigate(`/history?orgUnitName=${row?.[dataStore[0].mappingVariables.nomeAsca]}&tei=${row.trackedEntity}&teiOU=${row.orgUnit}&enrollment=${row.enrollment}`)
      },
    },
    {
      icon: <Assignment />,
      color: '#d64d4d',
      disabled:  row?.totalFinancimanetos > 0 ? false : true,
      label: 'Visualizar Último Financiamento',
      onClick: () => {
        setOpenEditionModal(!openEditionModal)
        buildFormData(row?.trackedEntity, dataStore[0].financiamento?.programStage!!)
        setActionPStage(dataStore[0].financiamento?.programStage!)
      },
    },
  ];

  const openEdit = () => {
    setOpenEditionModal(!openEditionModal)
    setActionPStage(dataStore[0].financiamento?.programStage!)
    setInitialValues({ ...row, disabled: false })
  }

  return (
    <div>
      <Actions openEdit={openEdit} editOption={editOption} inactive={inactive} menuItems={menuItems} completing={false} />
      {
        openEditionModal &&
        <ModalComponent title={title} open={openEditionModal} setOpen={setOpenEditionModal}>
          <ModalContentProgramStages
            open={openEditionModal}
            setOpen={setOpenEditionModal}
            nexProgramStage={actionPStage as string}
            loading={loading}
            formInitialValues={{
              ...initialValues,
              "nomeAsca": row[dataStore[0].mappingVariables.nomeAsca] ?? orgUnitName
            }}
            row={row}
            mapping={dataStore[0].mappingVariables}
          />
        </ModalComponent>
      }
    </div>
  );
}
