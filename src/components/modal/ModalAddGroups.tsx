import React, { useState, useRef, useEffect } from "react";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent } from "@dhis2/ui";
import { Form } from "react-final-form";
import format from "date-fns/format";
import GroupForm from "../form/GroupForm.js";
import { useRecoilValue } from "recoil";
import useValidateOuName from "../../hooks/organisationUnit/useValidateOrgUnitName";
import useCreateGroup from "../../hooks/organisationUnit/useCreateGroup";
import { formFields } from "../../utils/constants/groupsForm/groupsForm.js";
import { postBody } from "../../utils/organisationUnit/formatDataForPost.js";
import WithPadding from "../template/WithPadding";
import { useGetOrgUnitCode } from "../../hooks/organisationUnit/useGetOrgUnitCode.js";
import { useParams } from "../../hooks/commons/useQueryParams";
import { CustomDhis2RulesEngine } from "../../hooks/programRules/rules-engine/RulesEngine.js";
import { formatKeyValueType } from "../../utils/programRules/formatKeyValueType.js";
import useGetGroupForm from "../../hooks/form/useGetGroupForm.js";
import { TabsState } from "../../schema/tabSchema.js";
import { ProgramConfigState } from "../../schema/programSchema.js";

function ModalContentAddGroups({ setOpen, parentId, formData }: any) {
  const formRef = useRef<any>(null);
  const [values, setValues] = useState({})
  const closeModal = () => setOpen(false);
  const { validateOuname, ouNameValidationObject, validating } = useValidateOuName()
  const { createGroup, loading } = useCreateGroup()
  const { orgUnitCode, loadingOrgUnitCode, getOrgUnitCode } = useGetOrgUnitCode()
  const [initialValues] = useState({ registrationDate: format(new Date(), "yyyy-MM-dd") })
  const { urlParamiters } = useParams()
  const { orgUnitName, orgUnit, program, tab } = urlParamiters()
  const programValues = useRecoilValue(ProgramConfigState)
  const selectedProgram = programValues?.find(x => x.id == program)
  const formfieldsData = formFields(ouNameValidationObject, formData, selectedProgram?.programTrackedEntityAttributes??[])
  const [fieldsWithValue, setFieldsWitValues] = useState<any[]>([...formfieldsData])
  const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
    variables: formfieldsData,
    values, type: "programStageSection", formatKeyValueType: formatKeyValueType(formfieldsData as any)
  })
  const { getAllDataElementsToPost } = useGetGroupForm()

  useEffect(() => {
    runRulesEngine(formfieldsData)
  }, [values, validating])

  useEffect(() => {
    if (parentId)
      void getOrgUnitCode(parentId)
  }, [parentId])

  function onBlur(event: any) {
    if (event?.target?.name == "ouName")
      validateOuname(values["ouName" as keyof typeof values])
  }

  function onSubmit() {
    const allFields = fieldsWithValue.flat()
    if (allFields.filter((element: any) => (element?.value === undefined && element.required))?.length === 0) {
      createGroup({ data: postBody(values, parentId).data, formData: { ...values, parentId: parentId }, closeModal, fieldsWithValue: getAllDataElementsToPost(tab!)!, values });
    }
  }

  function onChange(e: any) {
    const sections = formData;

    for (let i = 0; i < sections?.length; i++) {
      const section = sections[i]

      for (let j = 0; j < section?.length; j++) {
        if (section[j].valueType === "TRUE_ONLY" && !section[j].value)
          section[j].value = ''

        if (section[j].valueType === "BOOLEAN")
          section[j].value = e[section[j].id]

        section[j].value = e[section[j].id]
      }
    }

    setValues(e)
    setFieldsWitValues(sections)
  }


  const modalActions = [
    { id: "cancel", type: "button", label: "Cancelar", disabled: loading, onClick: () => { setOpen(false) } },
    { id: "saveandcontinue", type: "submit", label: "Salvar", primary: true, disabled: loading || validating || ouNameValidationObject?.error || loadingOrgUnitCode, loading: loading }
  ];

  if (loadingOrgUnitCode) {
    return (
      <CenteredContent >
        <CircularLoader />
      </CenteredContent>
    )
  }

  return (
    <WithPadding p="0px">
      <span className="text-secondary">Por favor, preencha todos os campos do formulário:</span>
      <Form initialValues={{ ...initialValues, groupCode: orgUnitCode, parentOrgUnit: orgUnitName }} onSubmit={onSubmit}>
        {({ handleSubmit, values, form }) => {
          formRef.current = form;
          return <form
            onSubmit={handleSubmit}
            onChange={onChange(values) as unknown as () => void}
            onBlur={(e) => onBlur(e) as unknown as () => void}
          >
            {
              updatedVariables?.map((field: any, index: number) => (
                <div className="my-3">
                  <GroupForm
                    name={field.section}
                    description={field.description}
                    key={index}
                    fields={field.fields}
                    disabled={false}
                  />
                </div>
              ))
            }
            <ModalActions>
              <ButtonStrip end>
                {modalActions.map((action, i) => (
                  <Button
                    key={i}
                    {...action}
                  >
                    {action.label}
                  </Button>
                ))}
              </ButtonStrip>
            </ModalActions>
          </form>
        }}
      </Form>
    </WithPadding>
  )
}

export default ModalContentAddGroups;
