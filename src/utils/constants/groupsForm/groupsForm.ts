import { CustomAttributeProps} from "../../../types/attributes/AttributeColumns";
import { FormSectionProps } from "../../../types/form/FieldsTypes";
import { Attribute } from "../../../types/generated/models";
import type { ValidationNameType } from "../../../types/form/validateOuNameObject";

function formFields(validationObj: ValidationNameType): FormSectionProps[] {
  return [
    {
      section: "",
      description: "",
      fields: [
        {
          id: "registrationDate",
          labelName: "Data do Cadastro",
          displayName: "Data do Cadastro",
          header: "Data do Cadastro",
          disabled: false,
          valueType: Attribute.valueType.DATE as unknown as CustomAttributeProps["valueType"],
          name: "registrationDate",
          required: true,
          visible: true,
          description: "Description for the field"
        },
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
          error:validationObj.error,
          warning:validationObj.warning
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
    }
  ];
}

export { formFields };
