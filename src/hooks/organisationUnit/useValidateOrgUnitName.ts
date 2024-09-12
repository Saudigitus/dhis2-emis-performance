import React from 'react'
import { useDataEngine } from '@dhis2/app-runtime';
import { ValidationNameType } from '../../types/form/validateOuNameObject';

const OU_CODE_QUERY: any = (code: string) => ({
    results: {
        resource: "organisationUnits",
        params: {
            filter: `name:eq:${code}`,
            fields: ""
        }
    }
})

const useValidateOuName = () => {
    const engine = useDataEngine()
    const [validationObject, setvalidationObject] = React.useState<ValidationNameType>({ validationText: '', warning: false, error: false })
    const [validating, setValidating] = React.useState<boolean>(false)

    function validateOuname(code: string) {
        setValidating(true)
        setvalidationObject({ validationText: 'A validar...', warning: true, error: false })

        engine.query(OU_CODE_QUERY(code), {
            onComplete: (res: any) => {
                res?.results?.pager?.total ? setvalidationObject({ validationText: 'Este nome já está a ser usado.', warning: false, error: true })
                    :
                    setvalidationObject({ validationText: '', warning: false, error: false })
                setValidating(false)
            },
            onError: () => { setValidating(false) },

        })
    }


    return { validateOuname, ouNameValidationObject: validationObject, validating }
}
export default useValidateOuName