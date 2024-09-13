// import { CustomAttributeProps} from "../../../types/attributes/AttributeColumns";
// import { FormSectionProps } from "../../../types/form/FieldsTypes";
import { Attribute } from "../../../types/generated/models";
import type { ValidationNameType } from "../../../types/form/validateOuNameObject";
import { CustomAttributeProps, VariablesTypes } from "../../../types/variables/AttributeColumns";
import { FormSectionProps } from "../../../types/fields/FieldsTypes";
import { format } from "date-fns";


const staticForm = () => {
  return {
    registeringorgUnit: {
      required: true,
      name: "parentOrgUnit",
      labelName: "Distrito",
      valueType: "TEXT",
      options: undefined,
      disabled: true,
      pattern: "",
      visible: true,
      description: "Distrito",
      searchable: false,
      error: false,
      programStage: "",
      content: "",
      id: "parentOrgUnit",
      displayName: "Distrito",
      header: "Distrito",
      type: VariablesTypes.DataElement,
      value: undefined
    },
    enrollmentDate: {
      required: true,
      name: "registrationDate",
      labelName: "Data do Cadastro",
      valueType: "DATE",
      options: undefined,
      disabled: false,
      pattern: "",
      visible: true,
      description: "Data do Cadastro",
      searchable: false,
      error: false,
      programStage: "",
      content: "",
      id: "registrationDate",
      displayName: "Data do Cadastro",
      header: "Data do Cadastro",
      type: VariablesTypes.DataElement,
      value: format(new Date(), "yyyy-MM-dd")
    }
  }
}

function formFields(validationObj: ValidationNameType, formData: any): FormSectionProps[] {
  const [mapeamentoFields = []] = formData

  return [
    {
      section: "Detalhes gerais",
      description: "Detalhes gerais",
      fields: [
        staticForm().enrollmentDate,
        staticForm().registeringorgUnit
      ]
    },
    {
      section: "Detalhes da ASCA",
      description: "Detalhes da ASCA",
      fields: [
        // {
        //   id: "registrationDate",
        //   labelName: "Data do Cadastro",
        //   displayName: "Data do Cadastro",
        //   header: "Data do Cadastro",
        //   disabled: false,
        //   valueType: Attribute.valueType.DATE as unknown as CustomAttributeProps["valueType"],
        //   name: "registrationDate",
        //   required: true,
        //   visible: true,
        //   description: "Description for the field"
        // },
        {
          id: "groupCode",
          labelName: "Código do Grupo",
          displayName: "Código do Grupo",
          header: "Código do Grupo",
          disabled: true,
          valueType: Attribute.valueType.TEXT as unknown as CustomAttributeProps["valueType"],
          name: "groupCode",
          required: true,
          visible: true,
          description: "Description for the field"
        },
        {
          id: "ouName",
          labelName: "Nome do Grupo",
          displayName: "Nome do Grupo",
          header: "Nome do Grupo",
          disabled: false,
          valueType: Attribute.valueType.TEXT as unknown as CustomAttributeProps["valueType"],
          name: "ouName",
          required: true,
          visible: true,
          description: "Description for the field",
          helpText: validationObj.validationText,
          content: validationObj.validationText,
          error: validationObj.error,
          warning: validationObj.warning,
          info: "Se não puder alterar o nome do grupo, combine o nome com o bairro ou distrito do grupo."
        },
        {
          id: "meetingAddress",
          labelName: "Endereço (Local dos encontros)",
          displayName: "Endereço (Local dos encontros)",
          header: "Endereço (Local dos encontros)",
          disabled: false,
          valueType: Attribute.valueType
            .TEXT as unknown as CustomAttributeProps["valueType"],
          name: "meetingAddress",
          required: true,
          visible: true,
          description: "Description for the field"
        },
        {
          id: "focalPointName",
          labelName: "Nome da Pessoa de Contacto",
          displayName: "Nome da Pessoa de Contacto",
          header: "Nome da Pessoa de Contacto",
          disabled: false,
          valueType: Attribute.valueType
            .TEXT as unknown as CustomAttributeProps["valueType"],
          name: "focalPointName",
          required: true,
          visible: true,
          description: "Description for the field"
        },
        {
          id: "focalPointPhone",
          labelName: "Telefone da Pessoa de Contacto",
          displayName: "Telefone da Pessoa de Contacto",
          header: "Telefone da Pessoa de Contacto",
          disabled: false,
          valueType: Attribute.valueType
            .TEXT as unknown as CustomAttributeProps["valueType"],
          name: "focalPointPhone",
          required: true,
          visible: true,
          description: "Description for the field"
        }
      ]
    },
    ...formData.map((field: any) => ({
      section: field.displayName,
      description: field.displayName,
      fields: field.fields

    })),
  ]
}

export { formFields };
