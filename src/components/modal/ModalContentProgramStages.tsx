import React, { useState, useEffect, useRef } from "react";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import { Form } from "react-final-form";
import GroupForm from "../form/GroupForm";
import { useRecoilState, useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import { onSubmitClicked } from "../../schema/formOnSubmitClicked";
import { ModalContentProgramStageProps, ModalContentProps } from "../../types/modal/ModalProps";
import { useParams, usePostTei } from "../../hooks";
import { CustomDhis2RulesEngine } from "../../hooks/programRules/rules-engine/RulesEngine";
import styles from "./modal.module.css";
import classNames from "classnames";
import { formatProgramStageSections } from "../../utils/events/formatProgramStageSections";
import { formatResponseDataElements } from "../../utils/events/formatResponseDataElements";

function ModalContentProgramStages(props: ModalContentProgramStageProps): React.ReactElement {
  const { setOpen, nexProgramStage } = props;
  const getProgram = useRecoilValue(ProgramConfigState);
  const { useQuery } = useParams();
  const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> = useRef(null);
  const orgUnit = useQuery().get("orgUnit");
  const [, setClicked] = useRecoilState<boolean>(onSubmitClicked);
  const [values, setValues] = useState<Record<string, string>>({})
  const { postTei, loading, data } = usePostTei()
  const [clickedButton, setClickedButton] = useState<string>("");

  console.log(getProgram.programStages.find((x) => x.id === nexProgramStage)?.programStageSections.map((x) => { return { ...x, fields: formatResponseDataElements(x.dataElements) } }));

  // console.log(getProgram.programStages);

  const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
    variables: getProgram.programStages.find((x) => x.id === nexProgramStage)?.programStageSections.map((x) => { return { ...x, fields: formatResponseDataElements(x.dataElements) } })!,
    values, type: "programStageSection",
    formatKeyValueType: {}
  })

  useEffect(() => {
    runRulesEngine()
  }, [values])

  useEffect(() => { setClicked(false) }, [])

  const modalActions = [
    { id: "cancel", type: "button", label: "Cancel", disabled: loading, onClick: () => { setClickedButton("cancel"); setOpen(false); } },
    { id: "saveandnew", type: "submit", label: "Save and add new", primary: true, disabled: loading, onClick: () => { setClickedButton("saveandnew"); setClicked(true) } },
    { id: "saveandcontinue", type: "submit", label: "Save and close", primary: true, disabled: loading, onClick: () => { setClickedButton("saveandcontinue"); setClicked(true) } }
  ];

  function onSubmit() {

  }

  function onChange() {

  }

  

  return (
    <WithPadding>
      <Form initialValues={{ orgUnit }} onSubmit={onSubmit}>
        {({ handleSubmit, values, form }) => {
          formRef.current = form;
          return <form
            onSubmit={handleSubmit}
            onChange={onChange() as unknown as () => void}
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
