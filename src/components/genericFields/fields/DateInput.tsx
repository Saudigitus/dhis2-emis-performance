import React from "react";
import { ReactFinalForm, InputFieldFF, hasValue } from "@dhis2/ui";
import { FormFieldsProps } from "../../../types/form/GenericFieldsTypes";
import { format } from "date-fns";
const { Field } = ReactFinalForm;

function DateInput(props: FormFieldsProps) {
  const maxDate = format(new Date(), 'yyyy-MM-dd')

  return (
    <Field
      {...props}
      type="date"
      component={InputFieldFF}
      validate={(Boolean(props.required)) && hasValue}
      disabled={props.disabled}
      max={maxDate}
    />
  );
}

export default DateInput;
