import React, { useState, useRef, useEffect } from "react";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent } from "@dhis2/ui";
import { Form } from "react-final-form";
import format from "date-fns/format";
import GroupForm from "../form/GroupForm.js";
import { useSetRecoilState } from "recoil";
import useValidateOuName from "../../hooks/organisationUnit/useValidateOrgUnitName";
import useCreateGroup from "../../hooks/organisationUnit/useCreateGroup";
import useDebounce from "../../utils/commons/useDebounce";
import { formFields } from "../../utils/constants/groupsForm/groupsForm.js";
import { postBody } from "../../utils/organisationUnit/formatDataForPost.js";
import WithPadding from "../template/WithPadding";
import { TeiRefetch } from "../../schema/refecthTeiSchema.js";
import { useGetOrgUnitCode } from "../../hooks/organisationUnit/useGetOrgUnitCode.js";
import { useParams } from "../../hooks/commons/useQueryParams";

function ModalContentAddGroups({ setOpen, parentId, formData }: any) {
  const formRef = useRef<any>(null);
  const [values, setValues] = useState({})
  const closeModal = () => setOpen(false);
  const { validateOuname, ouNameValidationObject, validating } = useValidateOuName()
  const { createGroup, loading } = useCreateGroup()
  const { orgUnitCode, loadingOrgUnitCode } = useGetOrgUnitCode(parentId)
  const [initialValues] = useState({ registrationDate: format(new Date(), "yyyy-MM-dd") })
  const debouncedValue = useDebounce(values["ouName" as keyof typeof values], 400)
  const setRefetch = useSetRecoilState(TeiRefetch)
  const { urlParamiters } = useParams()
  const { schoolName } = urlParamiters()

  useEffect(() => {
    setRefetch(false)
  }, [])

  useEffect(() => {
    if (values["ouName" as keyof typeof values])
      validateOuname(values["ouName" as keyof typeof values])
  }, [debouncedValue])

  function onSubmit() {
    createGroup({ data: postBody(values, parentId).data, formData: { ...values, parentId: parentId }, closeModal });
  }

  function onChange(e: any) {
    setValues(e)
  }


  const modalActions = [
    { id: "cancel", type: "button", label: "Cancelar", disabled: loading, onClick: () => { setOpen(false) } },
    { id: "saveandcontinue", type: "submit", label: "Salvar", primary: true, disabled: loading || validating || ouNameValidationObject?.error, loading }
  ];

  if (loadingOrgUnitCode || loading) {
    return (
      <CenteredContent >
        <CircularLoader />
      </CenteredContent>
    )
  }

  return (
    <WithPadding p="0px">
      <span className="text-secondary">Por favor, preencha todos os campos do formulário:</span>
      <Form initialValues={{ ...initialValues, groupCode: orgUnitCode, parentOrgUnit: schoolName }} onSubmit={onSubmit}>
        {({ handleSubmit, values, form }) => {
          formRef.current = form;
          return <form
            onSubmit={handleSubmit}
            onChange={onChange(values) as unknown as () => void}
          >
            {
              formFields(ouNameValidationObject, formData).map((field, index,) => (
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
