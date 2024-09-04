import React, { useState, useEffect, useRef } from "react";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import { Form } from "react-final-form";
import GroupForm from "../form/GroupForm";
import { useRecoilState, useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { onSubmitClicked } from "../../schema/formOnSubmitClicked";
import { ModalContentProgramStageProps, ModalContentProps } from "../../types/modal/ModalProps";
import { useParams } from "../../hooks";
import { CustomDhis2RulesEngine } from "../../hooks/programRules/rules-engine/RulesEngine";
import styles from "./modal.module.css";
import classNames from "classnames";
import { formatResponseDataElements, formEvents } from "../../utils/events/formatResponseDataElements";
import { removeFalseKeys } from "../../utils/commons/removeFalseKeys";
import { usePostEvent } from "../../hooks/events/useCreateEvents";

function ModalContentProgramStages(props: ModalContentProgramStageProps): React.ReactElement {
  const { setOpen, nexProgramStage, loading: loadingEvents, formInitialValues, row } = props;
  const getProgram = useRecoilValue(ProgramConfigState);
  const { useQuery } = useParams();
  const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> = useRef(null);
  const orgUnit = useQuery().get("orgUnit");
  const [, setClicked] = useRecoilState<boolean>(onSubmitClicked);
  const [values, setValues] = useState<Record<string, string>>({})
  const { updateEvent, loadUpdateEvent: loading, data } = usePostEvent()
  const [clickedButton, setClickedButton] = useState<string>("");

  const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
    variables: [
      ...formEvents(getProgram.programStages.find((x) => x.id === nexProgramStage)?.executionDateLabel),
      ...getProgram.programStages.find((x) => x.id === nexProgramStage)?.programStageSections.map((x) => { return { ...x, fields: formatResponseDataElements(x.dataElements) } })!
    ],
    values, type: "programStageSection",
    formatKeyValueType: {}
  })

  useEffect(() => {
    runRulesEngine()
  }, [values])

  useEffect(() => { setClicked(false) }, [])

  const modalActions = [
    { id: "cancel", type: "button", label: "Cancelar", disabled: loading, onClick: () => { setClickedButton("cancel"); setOpen(false); } },
    { id: "saveandcontinue", type: "submit", label: "Salvar", primary: true, disabled: loading, onClick: () => { setClickedButton("saveandcontinue"); setClicked(true) } }
  ];

  function onSubmit() {
    const transformedArray = Object.entries(values).map(([key, value]) => ({
      dataElement: key,
      value: value
    }));

    const formToPost = {
      event: transformedArray.filter((x) => x.dataElement === "event")?.[0].value,
      occurredAt: transformedArray.filter((x) => x.dataElement === "eventDate")?.[0].value,
      scheduledAt: transformedArray.filter((x) => x.dataElement === "eventDate")?.[0].value,
      createdAt: transformedArray.filter((x) => x.dataElement === "eventDate")?.[0].value,
      dataValues: transformedArray.filter((x) => (x.dataElement !== "eventDate" && x.dataElement !== "event" && x.dataElement !== "orgUnit"))
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
                    disabled={false}
                  />
                )
              })
            }
            <br />
            <ModalActions>
              <ButtonStrip end className={classNames(styles.modalButtonsStrip)}>
                {modalActions.map((action, i) => {
                  return (
                    <>
                      {
                        <Button
                          key={i}
                          {...action}
                          className={styles.modalButtons}
                          loading={(!!(loading) && action.id === clickedButton)}
                        >
                          {action.label}
                        </Button>
                      }
                    </>
                  )
                })}
              </ButtonStrip>
            </ModalActions>
          </form>
        }}
      </Form>
    </WithPadding >
  )
}

export default ModalContentProgramStages;
