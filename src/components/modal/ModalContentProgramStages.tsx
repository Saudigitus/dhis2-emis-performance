import React, { useState, useEffect, useRef } from "react";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent } from "@dhis2/ui";
import { NoticeBox } from '@dhis2/ui'
import WithPadding from "../template/WithPadding";
import { Form } from "react-final-form";
import GroupForm from "../form/GroupForm";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { onSubmitClicked } from "../../schema/formOnSubmitClicked";
import { ModalContentProgramStageProps } from "../../types/modal/ModalProps";
import { useParams } from "../../hooks";
import { CustomDhis2RulesEngine } from "../../hooks/programRules/rules-engine/RulesEngine";
import styles from "./modal.module.css";
import classNames from "classnames";
import { formatResponseDataElements, formEvents } from "../../utils/events/formatResponseDataElements";
import { removeFalseKeys } from "../../utils/commons/removeFalseKeys";
import { usePostEvent } from "../../hooks/events/useCreateEvents";
import { TeiRefetch } from "../../schema/refecthTeiSchema";

function ModalContentProgramStages(props: ModalContentProgramStageProps): React.ReactElement {
  const { setOpen, nexProgramStage, loading: loadingEvents, formInitialValues, row } = props;
  const getProgram = useRecoilValue(ProgramConfigState);
  const { urlParamiters } = useParams();
  const { orgUnit, tei, teiOU, enrollment } = urlParamiters()
  const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> = useRef(null);
  const [, setClicked] = useRecoilState<boolean>(onSubmitClicked);
  const [values, setValues] = useState<Record<string, string>>({})
  const { updateEvent, loadUpdateEvent: loading, data } = usePostEvent()
  const [clickedButton, setClickedButton] = useState<string>("");
  const [disabled, setdisabled] = useState(formInitialValues?.disabled ?? true)
  const setRefetch = useSetRecoilState(TeiRefetch)

  const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
    variables: [
      ...formEvents(getProgram.programStages.find((x) => x.id === nexProgramStage)?.executionDateLabel),
      ...getProgram.programStages.find((x) => x.id === nexProgramStage)?.programStageSections.map((x) => { return { ...x, fields: formatResponseDataElements(x.dataElements) } })!
    ],
    values, type: "programStageSection",
    formatKeyValueType: {}
  })

  useEffect(() => {
    if (data && data["status" as unknown as keyof typeof data] === "OK") {
      setOpen(false)
      setClicked(false)
      formRef.current.restart()
      setRefetch(true)
    }
  }, [data])

  useEffect(() => {
    runRulesEngine()
  }, [values])

  useEffect(() => { setClicked(false) }, [])

  const modalActions = [
    { id: "cancel", type: "button", label: "Cancelar", disabled: loading, onClick: () => { setClickedButton("cancel"); setOpen(false); } },
    { id: "saveandcontinue", type: "submit", label: "Salvar", primary: true, disabled: loading, onClick: () => { setClickedButton("saveandcontinue"); setClicked(true) } }
  ];

  const modalActionsEdit = [
    { id: "cancel", type: "button", label: "Cancelar", disabled: loading, onClick: () => { setClickedButton("cancel"); setOpen(false); } },
    { id: "edit", label: "Editar", primary: true, disabled: loading, onClick: () => { setdisabled(false) } }
  ];

  function onSubmit() {
    if (clickedButton === "saveandcontinue") {
      const exclude = ["nomeAsca", "event", "orgUnit", "eventDate", "occurredAt"]
      const transformedArray = Object.entries(values).map(([key, value]) => ({
        dataElement: key,
        value: value
      }));

      const formToPost = {
        orgUnit: row.orgUnit ?? teiOU,
        status: "ACTIVE",
        programStage: nexProgramStage,
        program: getProgram.id,
        notes: [],
        enrollment: row.enrollment ?? enrollment,
        trackedEntity: row.trackedEntity ?? tei,
        event: transformedArray.filter((x) => x.dataElement === "event")?.[0].value,
        occurredAt: transformedArray.filter((x) => x.dataElement === "eventDate")?.[0].value,
        scheduledAt: transformedArray.filter((x) => x.dataElement === "eventDate")?.[0].value,
        createdAt: transformedArray.filter((x) => x.dataElement === "eventDate")?.[0].value,
        dataValues: transformedArray.filter((x) => !exclude.includes(x.dataElement))
      }
      updateEvent({ data: { events: [formToPost] } })
    }
  }

  function onChange(e: any): void {
    setValues(removeFalseKeys(e))
  }

  if (loadingEvents) {
    return (
      <CenteredContent className={styles.loaderContainer}>
        <CircularLoader />
      </CenteredContent>
    )
  }

  return (
    <WithPadding>
      {(formInitialValues.event && disabled) &&
        <div>
          <NoticeBox warning title="Registo existente">
            <div>
              Este grupo já possue o evento registado, se deseja editar pressione em "Editar".
            </div>
            <br />
            {
              modalActionsEdit.map((action, i) => {
                return (
                  <span style={{ marginRight: 10 }}>
                    {
                      <Button
                        small
                        key={i}
                        {...action}
                        loading={(loading && action.id === clickedButton)}
                      >
                        {action.label}
                      </Button>
                    }
                  </span>
                )
              })
            }
          </NoticeBox>
        </div>
      }
      <WithPadding />
      <Form initialValues={{ orgUnit, ...formInitialValues }} onSubmit={onSubmit}>
        {({ handleSubmit, values, form }) => {
          formRef.current = form;
          return <form
            onSubmit={handleSubmit}
            onChange={onChange(values) as unknown as () => void}
          >
            {
              updatedVariables?.map((field: any, index: number) => {
                return (
                  <GroupForm
                    name={field.displayName}
                    description={field.description}
                    key={index}
                    fields={field.fields}
                    disabled={(formInitialValues.event && disabled) ? true : false}
                  />
                )
              })
            }
            <br />
            <ModalActions>
              <ButtonStrip end className={classNames(styles.modalButtonsStrip)}>
                {
                  !(formInitialValues.event && disabled) &&
                  modalActions.map((action, i) => {
                    return (
                      <>
                        {
                          <Button
                            key={i}
                            {...action}
                            className={styles.modalButtons}
                            loading={(loading && action.id === clickedButton)}
                          >
                            {action.label}
                          </Button>
                        }
                      </>
                    )
                  })
                }
              </ButtonStrip>
            </ModalActions>
          </form>
        }}
      </Form>
    </WithPadding >
  )
}

export default ModalContentProgramStages;
