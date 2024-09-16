// import { useDataEngine, useDataQuery } from "@dhis2/app-runtime"
// import { format } from "date-fns"
// import { useSearchParams } from "react-router-dom"
// import { useRecoilState, useRecoilValue } from "recoil"
// import { HeaderFieldsState } from "../../schema/headersSchema"
// import { ProgramConfigState } from "../../schema/programSchema"
// import type { EventQueryProps } from "../../types/api/WithoutRegistrationProps"
// import type { TeiQueryProps } from "../../types/api/WithRegistrationProps"
// import { Attribute } from "../../types/generated/models"
// import type { useExportTemplateProps } from "../../types/modal/ModalProps"
// import { VariablesTypes } from "../../types/variables/AttributeColumns"
// import { convertNumberToLetter } from "../../utils/commons/convertNumberToLetter"
// import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys"
// import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
// import { capitalizeString } from "../../utils/commons/formatCamelCaseToWords"
// import {
//   cellBorders,
//   cellFillBg
// } from "../../utils/constants/exportTemplate/templateStyles"
// import { formatResponseRows } from "../../utils/table/rows/formatResponseRows"
// import { useParams } from "../commons/useQueryParams"
// import { validationSheetConstructor } from "./validationSheetConstructor"
// import useShowAlerts from "../commons/useShowAlert"
// import { TermMarksState } from "../../schema/termMarksSchema"

// export enum SectionVariablesTypes {
//   EnrollmentDetails = "Enrollment Details",
//   Profile = "Student Profile"
// }

// const oneProgramQuery: any = {
//   program: {
//     resource: "programs",
//     id: ({ programId }: { programId: string }) => programId,
//     params: {
//       fields: [
//         "id,displayName,programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,unique,generated,optionSetValue,optionSet[id,displayName,options[id,displayName,code]]]],programStages[id,displayName,programStageDataElements[compulsory,dataElement[id,displayName,valueType,optionSetValue,optionSet[id,displayName,options[id,displayName,code]]]]"
//       ]
//     }
//   }
// }

// const reserveValuesQuery: any = {
//   values: {
//     resource: "trackedEntityAttributes",
//     id: ({
//       numberOfReserve,
//       attributeID
//     }: {
//       numberOfReserve: number
//       attributeID: string
//     }) => `${attributeID}/generateAndReserve?numberToReserve=${numberOfReserve}`
//   }
// }

// const EVENT_QUERY = ({
//   ouMode,
//   page,
//   pageSize,
//   program,
//   order,
//   programStage,
//   filter,
//   orgUnit,
//   filterAttributes,
//   trackedEntity
// }: EventQueryProps) => ({
//   results: {
//     resource: "tracker/events",
//     params: {
//       order,
//       page,
//       pageSize,
//       ouMode,
//       program,
//       programStage,
//       orgUnit,
//       filter,
//       trackedEntity,
//       filterAttributes,
//       fields: "*"
//     }
//   }
// })

// const TEI_QUERY = ({
//   ouMode,
//   pageSize,
//   program,
//   trackedEntity,
//   orgUnit,
//   order,
//   programStatus
// }: TeiQueryProps) => ({
//   results: {
//     resource: "tracker/trackedEntities",
//     params: {
//       program,
//       order,
//       ouMode,
//       programStatus,
//       pageSize,
//       trackedEntity,
//       orgUnit,
//       fields:
//         "trackedEntity,trackedEntityType,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,orgUnit,program,trackedEntity]"
//     }
//   }
// })

// export default function useExportTemplate() {
//   const engine = useDataEngine()
//   const { program, registration } = getDataStoreKeys()
//   const { urlParamiters } = useParams()
//   const programConfig = useRecoilValue(ProgramConfigState)
//   const headerFieldsState = useRecoilValue(HeaderFieldsState)
//   const [selectedTerm] = useRecoilState(TermMarksState)

//   const { school, programStage } = urlParamiters()
//   const [searchParams] = useSearchParams()
//   const { hide, show } = useShowAlerts()
//   const { refetch: loadOneProgram } = useDataQuery(oneProgramQuery, {
//     lazy: true
//   })
//   const { refetch: loadReserveValues } = useDataQuery(reserveValuesQuery, {
//     lazy: true
//   })
//   const { getDataStoreData: programConfigDataStore } = getSelectedKey()

//   async function generateInformations(inputValues: useExportTemplateProps) {
//     const sectionType: string | null = searchParams.get("sectionType")

//     if (!sectionType) {
//       throw new Error("Couldn't find section type in url params")
//     }
//     if (!programConfigDataStore?.program) {
//       throw Error("Couldn't get program uid from datastore << values >>")
//     }
//     const { program: programId, registration }: any = programConfigDataStore
//     const correspondingProgram: any = await loadOneProgram({ programId })

//     if (!correspondingProgram?.program) {
//       throw Error(`Couldn't find program << ${programId} >> in DHIS2`)
//     }

//     if (!registration) {
//       throw Error(`Couldn't find registration config in datastore`)
//     }

//     if (!programConfigDataStore?.["performance"]) {
//       throw Error(`Couldn't find performance config in datastore`)
//     }

//     const currentAttributes =
//       correspondingProgram?.program?.programTrackedEntityAttributes?.map(
//         (p: { mandatory: boolean; trackedEntityAttribute: any }) => {
//           return { mandatory: p.mandatory, ...p.trackedEntityAttribute }
//         }
//       ) || []

//     let newHeaders: any = []
//     const newDataList: any = []

//     if (currentAttributes.length > 0) {
//       newHeaders = currentAttributes.map((attribute: any) => ({
//         key: attribute.id,
//         id: attribute.id,
//         unique: attribute.unique || false,
//         generated: attribute.generated || false,
//         valueType: attribute.valueType,
//         label: attribute.displayName,
//         optionSetValue: attribute.optionSetValue || false,
//         options: attribute.optionSet?.options || [],
//         optionSetId: attribute.optionSet?.id || null,
//         required: attribute.mandatory || false,
//         metadataType: VariablesTypes.Attribute,
//         sectionDataType: SectionVariablesTypes.Profile
//       }))
//     }

//     const reserveValuePayload: any = {}

//     for (let attr of newHeaders) {
//       if (attr.unique && attr.generated) {
//         const reserveValueResponse: any = await loadReserveValues({
//           numberOfReserve: +inputValues.studentsNumber,
//           attributeID: attr.id
//         })
//         if (reserveValueResponse?.values?.length > 0) {
//           reserveValuePayload[`${attr.id}`] = reserveValueResponse.values
//         }
//       }
//     }

//     const registrationProgramStageDataElements =
//       correspondingProgram?.program?.programStages?.reduce(
//         (prev: any, curr: any) => {
//           if (curr.id === registration.programStage) {
//             const newDataElements =
//               curr.programStageDataElements?.reduce(
//                 (dxPrev: any, dxCurr: any) => {
//                   dxPrev.push({
//                     key: `${registration.programStage}.${dxCurr.dataElement?.id}`,
//                     id: `${registration?.programStage}.${dxCurr.dataElement?.id}`,
//                     label: dxCurr.dataElement?.displayName,
//                     valueType: dxCurr.dataElement?.valueType,
//                     optionSetValue: dxCurr.dataElement?.optionSetValue || false,
//                     options: dxCurr.dataElement?.optionSet?.options || [],
//                     optionSetId: dxCurr.dataElement?.optionSet?.id || null,
//                     required: dxCurr?.compulsory || false,
//                     metadataType: VariablesTypes.DataElement,
//                     sectionDataType: SectionVariablesTypes.EnrollmentDetails
//                   })
//                   return dxPrev
//                 },
//                 []
//               ) || []

//             prev = [...prev, ...newDataElements]
//             return prev
//           }

//           return prev
//         },
//         []
//       ) || []

//     const finalResultsProgramStageDataElements =
//       correspondingProgram?.program?.programStages?.reduce(
//         (prev: any, curr: any) => {
//           if (curr.id === programStage) {
//             const newDataElements =
//               curr.programStageDataElements?.reduce(
//                 (dxPrev: any, dxCurr: any) => {
//                   dxPrev.push({
//                     key: `${programStage}.${dxCurr.dataElement?.id}`,
//                     id: `${programStage}.${dxCurr.dataElement?.id}`,
//                     label: dxCurr.dataElement?.displayName,
//                     valueType: dxCurr.dataElement?.valueType,
//                     optionSetValue: dxCurr.dataElement?.optionSetValue || false,
//                     options: dxCurr.dataElement?.optionSet?.options || [],
//                     optionSetId: dxCurr.dataElement?.optionSet?.id || null,
//                     required: dxCurr?.compulsory || false,
//                     metadataType: VariablesTypes.DataElement,
//                     sectionDataType: selectedTerm.label
//                   })
//                   return dxPrev
//                 },
//                 []
//               ) || []
//             prev = [...prev, ...newDataElements]
//             return prev
//           }
//           return prev
//         },
//         []
//       ) || []

//     const newBeginHeaders = [
//       {
//         key: `ref`,
//         id: `ref`,
//         label: "Ref",
//         valueType: "TEXT",
//         optionSetValue: false,
//         options: [],
//         optionSetId: null,
//         required: false
//       },
//       {
//         key: `orgUnitName`,
//         id: `orgUnitName`,
//         label: "School Name",
//         valueType: "TEXT",
//         optionSetValue: false,
//         options: [],
//         optionSetId: null,
//         required: true
//       },
//       {
//         key: `orgUnit`,
//         id: `orgUnit`,
//         label: "School UID",
//         valueType: "TEXT",
//         optionSetValue: false,
//         options: [],
//         optionSetId: null,
//         required: true
//       },
//       {
//         key: `trackedEntity`,
//         id: `trackedEntity`,
//         label: "Tracked Entity",
//         valueType: "TEXT",
//         optionSetValue: false,
//         options: [],
//         optionSetId: null,
//         required: true
//       },
//       {
//         key: `enrollmentDate`,
//         id: `enrollmentDate`,
//         label: "Enrollment date",
//         valueType: "DATE",
//         optionSetValue: false,
//         options: [],
//         optionSetId: null,
//         required: true
//       },
//       {
//         key: `enrollment`,
//         id: `enrollment`,
//         label: "Enrollment",
//         valueType: "TEXT",
//         optionSetValue: false,
//         options: [],
//         optionSetId: null,
//         required: true
//       },
//       {
//         key: `event`,
//         id: `event`,
//         label: "Event",
//         valueType: "TEXT",
//         optionSetValue: false,
//         options: [],
//         optionSetId: null,
//         required: true
//       }
//     ]

//     const newBeginHeadersFormatted = newBeginHeaders.map((header) => {
//       return {
//         ...header,
//         metadataType: VariablesTypes.Default,
//         sectionDataType: SectionVariablesTypes.EnrollmentDetails
//       }
//     })

//     newHeaders = [
//       ...newBeginHeadersFormatted,
//       ...newHeaders,
//       ...registrationProgramStageDataElements,
//       ...finalResultsProgramStageDataElements
//     ]

//     if (+inputValues.studentsNumber > 0) {
//       for (let i = 0; i < +inputValues.studentsNumber; i++) {
//         const payload: any = {}
//         let incrementHeader = 0
//         for (let newHeader of newHeaders) {
//           let value = ""
//           if (incrementHeader === 0) value = `${i + 1}`
//           if (incrementHeader === 1) value = `${inputValues.orgUnitName}`
//           if (incrementHeader === 2) value = `${inputValues.orgUnit}`
//           if (incrementHeader === 3)
//             value = `${format(
//               new Date(),
//               `${inputValues.academicYearId}-MM-dd`
//             )}`
//           if (incrementHeader === 4) value = `${inputValues.academicYearId}`

//           if (incrementHeader > 3) {
//             const found_reserv = reserveValuePayload[newHeader.id]
//             if (found_reserv) {
//               value = found_reserv[0].value
//               reserveValuePayload[newHeader.id] = reserveValuePayload[
//                 newHeader.id
//               ].filter((resVam: { value: any }) => value !== resVam.value)
//             }
//           }

//           payload[`${newHeader.id}`] = {
//             label: newHeader.label,
//             value
//           }
//           incrementHeader++
//         }

//         newDataList.push(payload)
//       }
//     }

//     return {
//       headers: newHeaders || [],
//       datas: newDataList || [],
//       currentProgram: correspondingProgram
//     }
//   }

//   async function handleExportToWord(values: useExportTemplateProps) {
//     try {
//       values.setLoadingExport && values.setLoadingExport(true)

//       const {
//         results: { instances: eventsInstances }
//       } = await engine.query(
//         EVENT_QUERY({
//           ouMode: "SELECTED",
//           paging: false,
//           program: program as unknown as string,
//           order: "createdAt:desc",
//           programStage: registration?.programStage as unknown as string,
//           filter: headerFieldsState?.dataElements,
//           filterAttributes: headerFieldsState?.attributes,
//           orgUnit: school
//         })
//       )

//       const allTeis: [] = eventsInstances.map(
//         (x: { trackedEntity: string }) => x.trackedEntity
//       )

//       const {
//         results: { instances: teiInstances }
//       } = await engine.query(
//         TEI_QUERY({
//           program: program as unknown as string,
//           trackedEntity: allTeis.join(";")
//         })
//       )

//       let marksInstances: any[] = []

//       for (const tei of allTeis) {
//         const {
//           results: { instances: marksData }
//         } = await engine.query(
//           EVENT_QUERY({
//             program: program as unknown as string,
//             order: "createdAt:desc",
//             programStage: programStage as string,
//             trackedEntity: tei
//           })
//         )

//         marksInstances = marksInstances.concat(marksData)
//       }

//       const localData = formatResponseRows({
//         eventsInstances,
//         teiInstances,
//         marksInstances,
//         programConfig: programConfig,
//         programStageId: programConfigDataStore["performance"].programStage
//       })
//       const workbook = new window.ExcelJS.Workbook()
//       const dataSheet = workbook.addWorksheet("Data")
//       const metaDataSheet = workbook.addWorksheet("Metadata")
//       const validationSheet = workbook.addWorksheet("Validation", {
//         state: "veryHidden"
//       })
//       const { headers, datas, currentProgram } = await generateInformations({
//         ...values,
//         studentsNumber: localData.length
//       })

//       // Generating validation data
//       validationSheetConstructor(validationSheet, headers)

//       // Add headers to the data sheet
//       dataSheet.columns = headers.map((header: any, index: number) => ({
//         header: `${header.label} ${header.required ? "*" : ""}`,
//         key: `${header.id}`,
//         width: index === 0 ? 20 : 30,
//         style: {
//           font: { bold: true }
//         }
//       }))
//       dataSheet.addRow(
//         headers.reduce((prev: any, curr: any) => {
//           prev[curr.id] = `${curr.label} ${curr.required ? "*" : ""}`
//           return prev
//         }, {})
//       )

//       // Create Sections for colSpan
//       const sections: any = {
//         [SectionVariablesTypes.EnrollmentDetails]: [],
//         [SectionVariablesTypes.Profile]: [],
//         [selectedTerm.label ?? ""]: []
//       }

//       headers.forEach((header: any) => {
//         sections[header.sectionDataType].push(header.id)
//       })

//       // Add the sections row above the headers row
//       let colIndex = 1
//       for (const section in sections) {
//         if (sections[section].length > 0) {
//           dataSheet.mergeCells(
//             1,
//             colIndex,
//             1,
//             colIndex + sections[section].length - 1
//           )
//           dataSheet.getCell(1, colIndex).alignment = {
//             horizontal: "center",
//             vertical: "middle"
//           }
//           dataSheet.getCell(1, colIndex).value = section
//           colIndex += sections[section].length
//         }
//       }

//       // Add background in the sections row
//       const firstRow = dataSheet.getRow(1)
//       headers.forEach((header: any, index: any) => {
//         const cell = firstRow.getCell(index + 1)
//         cell.fill = cellFillBg(header.sectionDataType)
//         cell.border = cellBorders
//         cell.font = { bold: true }
//       })

//       // Add background in the headers row
//       const secondRow = dataSheet.getRow(2)
//       headers.forEach((header: any, index: any) => {
//         const cell = secondRow.getCell(index + 1)
//         cell.fill = cellFillBg(header.metadataType)
//         cell.border = cellBorders
//         cell.font = { bold: true }

//         // Hide the orgUnit ID column
//         if (header.id === "orgUnit") {
//           dataSheet.getColumn(index + 1).hidden = true
//         }
//         // Hide the Event ID column
//         if (header.id === "event") {
//           dataSheet.getColumn(index + 1).hidden = true
//         }
//         // Hide the enrollment ID column
//         if (header.id === "enrollment") {
//           dataSheet.getColumn(index + 1).hidden = true
//         }
//         // Hide the trackedEntity ID column
//         if (header.id === "trackedEntity") {
//           dataSheet.getColumn(index + 1).hidden = true
//         }
//       })

//       // Add the data rows
//       let index = 0
//       for (let data of datas) {
//         const rowData = localData[index]
//         const row = dataSheet.addRow(
//           headers.map((curr: any) => {
//             const allIds = String(curr.id).split(".")
//             const id = allIds[allIds.length - 1]
//             if (rowData[id] && typeof rowData[id] === "object") {
//               return rowData[`${id}-val`]
//             }

//             return rowData[id] ?? data[id]?.value
//           })
//         )
//         index++

//         // Lock the attribute cells and columns: Academic Year, Grade, Class/Section
//         headers.forEach((header: any, idx: number) => {
//           const cell = row.getCell(idx + 1)
//           if (
//             header.metadataType === VariablesTypes.Attribute ||
//             header.id === "academicYear" ||
//             header.id === "grade" ||
//             header.id === "classSection"
//           ) {
//             cell.protection = { locked: true }
//           } else {
//             cell.protection = { locked: false }
//           }

//           // Apply number validation for 0-100
//           if (header.valueType === "NUMBER") {
//             cell.dataValidation = {
//               type: "whole",
//               operator: "between",
//               formula1: "0",
//               formula2: "100",
//               showErrorMessage: true,
//               errorTitle: "Invalid Entry",
//               error: "Please enter a number between 0 and 100."
//             }
//           }
//         })
//       }

//       // Protect the data sheet but allow editing of unlocked cells
//       dataSheet.protect("", {
//         selectLockedCells: true,
//         selectUnlockedCells: true,
//         formatCells: true,
//         formatColumns: false,
//         formatRows: false,
//         insertColumns: false,
//         insertRows: false,
//         deleteColumns: false,
//         deleteRows: false,
//         sort: false,
//         autoFilter: false,
//         pivotTables: false
//       })

//       // Freeze the header rows
//       dataSheet.views = [
//         { state: "frozen", ySplit: 1 },
//         { state: "frozen", ySplit: 2 }
//       ]

//       workbook.xlsx.writeBuffer().then((buffer: any) => {
//         const blob = new Blob([buffer], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         })
//         window.saveAs(
//           blob,
//           `${capitalizeString(
//             searchParams.get("sectionType") ?? ""
//           )} Data Import - Template.xlsx`
//         )
//       })

//       show({
//         message: "File exported successfully",
//         type: { success: true }
//       })
//       setTimeout(hide, 5000)
//       values.setLoadingExport && values.setLoadingExport(false)
//     } catch (err: any) {
//       console.log(err)
//       show({
//         message: err.message,
//         type: { critical: true }
//       })
//       setTimeout(hide, 5000)
//       values.setLoadingExport && values.setLoadingExport(false)
//     }
//   }

//   return {
//     handleExportToWord
//   }
// }
import { useDataEngine, useDataQuery } from "@dhis2/app-runtime"
import { format } from "date-fns"
import { useSearchParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { HeaderFieldsState } from "../../schema/headersSchema"
import { ProgramConfigState } from "../../schema/programSchema"
import type { EventQueryProps } from "../../types/api/WithoutRegistrationProps"
import type { TeiQueryProps } from "../../types/api/WithRegistrationProps"
import { Attribute } from "../../types/generated/models"
import type { useExportTemplateProps } from "../../types/modal/ModalProps"
import { VariablesTypes } from "../../types/variables/AttributeColumns"
import { convertNumberToLetter } from "../../utils/commons/convertNumberToLetter"
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
import { capitalizeString } from "../../utils/commons/formatCamelCaseToWords"
import {
  cellBorders,
  cellFillBg
} from "../../utils/constants/exportTemplate/templateStyles"
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows"
import { useParams } from "../commons/useQueryParams"
import { validationSheetConstructor } from "./validationSheetConstructor"
import useShowAlerts from "../commons/useShowAlert"
import { TermMarksState } from "../../schema/termMarksSchema"

export enum SectionVariablesTypes {
  EnrollmentDetails = "Enrollment Details",
  Profile = "Student Profile"
}

const oneProgramQuery: any = {
  program: {
    resource: "programs",
    id: ({ programId }: { programId: string }) => programId,
    params: {
      fields: [
        "id,displayName,programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,unique,generated,optionSetValue,optionSet[id,displayName,options[id,displayName,code]]]],programStages[id,displayName,programStageDataElements[compulsory,dataElement[id,displayName,valueType,optionSetValue,optionSet[id,displayName,options[id,displayName,code]]]]"
      ]
    }
  }
}

const reserveValuesQuery: any = {
  values: {
    resource: "trackedEntityAttributes",
    id: ({
      numberOfReserve,
      attributeID
    }: {
      numberOfReserve: number
      attributeID: string
    }) => `${attributeID}/generateAndReserve?numberToReserve=${numberOfReserve}`
  }
}

const EVENT_QUERY = ({
  ouMode,
  page,
  pageSize,
  program,
  order,
  programStage,
  filter,
  orgUnit,
  filterAttributes,
  trackedEntity
}: EventQueryProps) => ({
  results: {
    resource: "tracker/events",
    params: {
      order,
      page,
      pageSize,
      ouMode,
      program,
      programStage,
      orgUnit,
      filter,
      trackedEntity,
      filterAttributes,
      fields: "*"
    }
  }
})

const TEI_QUERY = ({
  ouMode,
  pageSize,
  program,
  trackedEntity,
  orgUnit,
  order,
  programStatus
}: TeiQueryProps) => ({
  results: {
    resource: "tracker/trackedEntities",
    params: {
      program,
      order,
      ouMode,
      programStatus,
      pageSize,
      trackedEntity,
      orgUnit,
      fields:
        "trackedEntity,trackedEntityType,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,orgUnit,program,trackedEntity]"
    }
  }
})

export default function useExportTemplate() {
  const engine = useDataEngine()
  const { program, registration } = getDataStoreKeys()
  const { urlParamiters } = useParams()
  const programConfig = useRecoilValue(ProgramConfigState)
  const headerFieldsState = useRecoilValue(HeaderFieldsState)
  const [selectedTerm] = useRecoilState(TermMarksState)

  const { school, programStage } = urlParamiters()
  const [searchParams] = useSearchParams()
  const { hide, show } = useShowAlerts()
  const { refetch: loadOneProgram } = useDataQuery(oneProgramQuery, {
    lazy: true
  })
  const { refetch: loadReserveValues } = useDataQuery(reserveValuesQuery, {
    lazy: true
  })
  const { getDataStoreData: programConfigDataStore } = getSelectedKey()

  async function generateInformations(inputValues: useExportTemplateProps) {
    const sectionType: string | null = searchParams.get("sectionType")

    if (!sectionType) {
      throw new Error("Couldn't find section type in url params")
    }
    if (!programConfigDataStore?.program) {
      throw Error("Couldn't get program uid from datastore << values >>")
    }
    const { program: programId, registration }: any = programConfigDataStore
    const correspondingProgram: any = await loadOneProgram({ programId })

    if (!correspondingProgram?.program) {
      throw Error(`Couldn't find program << ${programId} >> in DHIS2`)
    }

    if (!registration) {
      throw Error(`Couldn't find registration config in datastore`)
    }

    if (!programConfigDataStore?.["performance"]) {
      throw Error(`Couldn't find performance config in datastore`)
    }

    const currentAttributes =
      correspondingProgram?.program?.programTrackedEntityAttributes?.map(
        (p: { mandatory: boolean; trackedEntityAttribute: any }) => {
          return { mandatory: p.mandatory, ...p.trackedEntityAttribute }
        }
      ) || []

    let newHeaders: any = []
    const newDataList: any = []

    if (currentAttributes.length > 0) {
      newHeaders = currentAttributes.map((attribute: any) => ({
        key: attribute.id,
        id: attribute.id,
        unique: attribute.unique || false,
        generated: attribute.generated || false,
        valueType: attribute.valueType,
        label: attribute.displayName,
        optionSetValue: attribute.optionSetValue || false,
        options: attribute.optionSet?.options || [],
        optionSetId: attribute.optionSet?.id || null,
        required: attribute.mandatory || false,
        metadataType: VariablesTypes.Attribute,
        sectionDataType: SectionVariablesTypes.Profile
      }))
    }

    const reserveValuePayload: any = {}

    for (let attr of newHeaders) {
      if (attr.unique && attr.generated) {
        const reserveValueResponse: any = await loadReserveValues({
          numberOfReserve: +inputValues.studentsNumber,
          attributeID: attr.id
        })
        if (reserveValueResponse?.values?.length > 0) {
          reserveValuePayload[`${attr.id}`] = reserveValueResponse.values
        }
      }
    }

    const registrationProgramStageDataElements =
      correspondingProgram?.program?.programStages?.reduce(
        (prev: any, curr: any) => {
          if (curr.id === registration.programStage) {
            const newDataElements =
              curr.programStageDataElements?.reduce(
                (dxPrev: any, dxCurr: any) => {
                  dxPrev.push({
                    key: `${registration.programStage}.${dxCurr.dataElement?.id}`,
                    id: `${registration?.programStage}.${dxCurr.dataElement?.id}`,
                    label: dxCurr.dataElement?.displayName,
                    valueType: dxCurr.dataElement?.valueType,
                    optionSetValue: dxCurr.dataElement?.optionSetValue || false,
                    options: dxCurr.dataElement?.optionSet?.options || [],
                    optionSetId: dxCurr.dataElement?.optionSet?.id || null,
                    required: dxCurr?.compulsory || false,
                    metadataType: VariablesTypes.DataElement,
                    sectionDataType: SectionVariablesTypes.EnrollmentDetails
                  })
                  return dxPrev
                },
                []
              ) || []

            prev = [...prev, ...newDataElements]
            return prev
          }

          return prev
        },
        []
      ) || []

    const finalResultsProgramStageDataElements =
      correspondingProgram?.program?.programStages?.reduce(
        (prev: any, curr: any) => {
          if (curr.id === programStage) {
            const newDataElements =
              curr.programStageDataElements?.reduce(
                (dxPrev: any, dxCurr: any) => {
                  dxPrev.push({
                    key: `${programStage}.${dxCurr.dataElement?.id}`,
                    id: `${programStage}.${dxCurr.dataElement?.id}`,
                    label: dxCurr.dataElement?.displayName,
                    valueType: dxCurr.dataElement?.valueType,
                    optionSetValue: dxCurr.dataElement?.optionSetValue || false,
                    options: dxCurr.dataElement?.optionSet?.options || [],
                    optionSetId: dxCurr.dataElement?.optionSet?.id || null,
                    required: dxCurr?.compulsory || false,
                    metadataType: VariablesTypes.DataElement,
                    sectionDataType: selectedTerm.label
                  })
                  return dxPrev
                },
                []
              ) || []
            prev = [...prev, ...newDataElements]
            return prev
          }
          return prev
        },
        []
      ) || []

    const newBeginHeaders = [
      {
        key: `ref`,
        id: `ref`,
        label: "Ref",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: false
      },
      {
        key: `orgUnitName`,
        id: `orgUnitName`,
        label: "School Name",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `orgUnit`,
        id: `orgUnit`,
        label: "School UID",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `trackedEntity`,
        id: `trackedEntity`,
        label: "Tracked Entity",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `enrollmentDate`,
        id: `enrollmentDate`,
        label: "Enrollment date",
        valueType: "DATE",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `enrollment`,
        id: `enrollment`,
        label: "Enrollment",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `event`,
        id: `event`,
        label: "Event",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      }
    ]

    const newBeginHeadersFormatted = newBeginHeaders.map((header) => {
      return {
        ...header,
        metadataType: VariablesTypes.Default,
        sectionDataType: SectionVariablesTypes.EnrollmentDetails
      }
    })

    newHeaders = [
      ...newBeginHeadersFormatted,
      ...newHeaders,
      ...registrationProgramStageDataElements,
      ...finalResultsProgramStageDataElements
    ]

    if (+inputValues.studentsNumber > 0) {
      for (let i = 0; i < +inputValues.studentsNumber; i++) {
        const payload: any = {}
        let incrementHeader = 0
        for (let newHeader of newHeaders) {
          let value = ""
          if (incrementHeader === 0) value = `${i + 1}`
          if (incrementHeader === 1) value = `${inputValues.orgUnitName}`
          if (incrementHeader === 2) value = `${inputValues.orgUnit}`
          if (incrementHeader === 3)
            value = `${format(
              new Date(),
              `${inputValues.academicYearId}-MM-dd`
            )}`
          if (incrementHeader === 4) value = `${inputValues.academicYearId}`

          if (incrementHeader > 3) {
            const found_reserv = reserveValuePayload[newHeader.id]
            if (found_reserv) {
              value = found_reserv[0].value
              reserveValuePayload[newHeader.id] = reserveValuePayload[
                newHeader.id
              ].filter((resVam: { value: any }) => value !== resVam.value)
            }
          }

          payload[`${newHeader.id}`] = {
            label: newHeader.label,
            value
          }
          incrementHeader++
        }

        newDataList.push(payload)
      }
    }

    return {
      headers: newHeaders || [],
      datas: newDataList || [],
      currentProgram: correspondingProgram
    }
  }

  async function handleExportToWord(values: useExportTemplateProps) {
    try {
      values.setLoadingExport && values.setLoadingExport(true)

      const {
        results: { instances: eventsInstances }
      } = await engine.query(
        EVENT_QUERY({
          ouMode: "SELECTED",
          paging: false,
          program: program as unknown as string,
          order: "createdAt:desc",
          programStage: registration?.programStage as unknown as string,
          filter: headerFieldsState?.dataElements,
          filterAttributes: headerFieldsState?.attributes,
          orgUnit: school
        })
      )

      const allTeis: [] = eventsInstances.map(
        (x: { trackedEntity: string }) => x.trackedEntity
      )

      const {
        results: { instances: teiInstances }
      } = await engine.query(
        TEI_QUERY({
          program: program as unknown as string,
          trackedEntity: allTeis.join(";")
        })
      )

      let marksInstances: any[] = []

      for (const tei of allTeis) {
        const {
          results: { instances: marksData }
        } = await engine.query(
          EVENT_QUERY({
            program: program as unknown as string,
            order: "createdAt:desc",
            programStage: programStage as string,
            trackedEntity: tei
          })
        )

        marksInstances = marksInstances.concat(marksData)
      }

      const localData = formatResponseRows({
        eventsInstances,
        teiInstances,
        marksInstances,
        programConfig: programConfig,
        programStageId: programConfigDataStore["performance"].programStage
      })
      const workbook = new window.ExcelJS.Workbook()
      const dataSheet = workbook.addWorksheet("Data")
      const metaDataSheet = workbook.addWorksheet("Metadata")
      const validationSheet = workbook.addWorksheet("Validation", {
        state: "veryHidden"
      })
      const { headers, datas, currentProgram } = await generateInformations({
        ...values,
        studentsNumber: localData.length
      })

      // Generating validation data
      validationSheetConstructor(validationSheet, headers)

      // Add headers to the data sheet
      dataSheet.columns = headers.map((header: any, index: number) => ({
        header: `${header.label} ${header.required ? "*" : ""}`,
        key: `${header.id}`,
        width: index === 0 ? 20 : 30,
        style: {
          font: { bold: true }
        }
      }))
      dataSheet.addRow(
        headers.reduce((prev: any, curr: any) => {
          prev[curr.id] = `${curr.label} ${curr.required ? "*" : ""}`
          return prev
        }, {})
      )

      // Create Sections for colSpan
      const sections: any = {
        [SectionVariablesTypes.EnrollmentDetails]: [],
        [SectionVariablesTypes.Profile]: [],
        [selectedTerm.label ?? ""]: []
      }

      headers.forEach((header: any) => {
        sections[header.sectionDataType].push(header.id)
      })

      // Add the sections row above the headers row
      let colIndex = 1
      for (const section in sections) {
        if (sections[section].length > 0) {
          dataSheet.mergeCells(
            1,
            colIndex,
            1,
            colIndex + sections[section].length - 1
          )
          dataSheet.getCell(1, colIndex).alignment = {
            horizontal: "center",
            vertical: "middle"
          }
          dataSheet.getCell(1, colIndex).value = section
          colIndex += sections[section].length
        }
      }

      // Add background in the sections row
      const firstRow = dataSheet.getRow(1)
      headers.forEach((header: any, index: any) => {
        const cell = firstRow.getCell(index + 1)
        cell.fill = cellFillBg(header.sectionDataType)
        cell.border = cellBorders
        cell.font = { bold: true }
      })

      // Add background in the headers row
      const secondRow = dataSheet.getRow(2)
      headers.forEach((header: any, index: any) => {
        const cell = secondRow.getCell(index + 1)
        cell.fill = cellFillBg(header.metadataType)
        cell.border = cellBorders
        cell.font = { bold: true }

        // Lock the Academic Year, Grade, and Class/Section columns
        if (
          header.id === "academicYear" ||
          header.id === "grade" ||
          header.id === "classSection"
        ) {
          dataSheet.getColumn(index + 1).protection = { locked: true }
        }

        // Set number validation for cells that should only accept numbers 0-100
        if (header.valueType === "NUMBER") {
          const colLetter = convertNumberToLetter(index + 1)
          dataSheet.getColumn(index + 1).eachCell((cell) => {
            cell.dataValidation = {
              type: "whole",
              operator: "between",
              formula1: "0",
              formula2: "100",
              showErrorMessage: true,
              errorTitle: "Invalid Number",
              error: "Please enter a value between 0 and 100."
            }
          })
        }

        // Hide the orgUnit ID column
        if (header.id === "orgUnit") {
          dataSheet.getColumn(index + 1).hidden = true
        }
        // Hide the Event ID column
        if (header.id === "event") {
          dataSheet.getColumn(index + 1).hidden = true
        }
        // Hide the enrollment ID column
        if (header.id === "enrollment") {
          dataSheet.getColumn(index + 1).hidden = true
        }
        // Hide the trackedEntity ID column
        if (header.id === "trackedEntity") {
          dataSheet.getColumn(index + 1).hidden = true
        }
      })

      // Add the data rows
      let index = 0
      for (let data of datas) {
        const rowData = localData[index]
        const row = dataSheet.addRow(
          headers.map((curr: any) => {
            const allIds = String(curr.id).split(".")
            const id = allIds[allIds.length - 1]
            if (rowData[id] && typeof rowData[id] === "object") {
              return rowData[`${id}-val`]
            }

            return rowData[id] ?? data[id]?.value
          })
        )
        index++

        // Validate that stage cells (number fields) are between 0 and 100
        headers.forEach((header: any, idx: number) => {
          const cell = row.getCell(idx + 1)

          // Apply validation for stage cells (only allow numbers between 0 and 100)
          if (
            header.metadataType === VariablesTypes.DataElement &&
            header.valueType === "NUMBER"
          ) {
            cell.dataValidation = {
              type: "whole",
              operator: "between",
              formula1: "0",
              formula2: "100",
              showErrorMessage: true,
              errorTitle: "Invalid Entry",
              error: "Please enter a number between 0 and 100."
            }
            cell.protection = { locked: false }
          }
        })
      }
      console.log(VariablesTypes)
      // Protect the data sheet but allow editing of unlocked cells
      dataSheet.protect("", {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: true,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false
      })

      // Freeze the header rows
      dataSheet.views = [
        { state: "frozen", ySplit: 1 },
        { state: "frozen", ySplit: 2 }
      ]

      workbook.xlsx.writeBuffer().then((buffer: any) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        })
        window.saveAs(
          blob,
          `${capitalizeString(
            searchParams.get("sectionType") ?? ""
          )} Data Import - Template.xlsx`
        )
      })

      show({
        message: "File exported successfully",
        type: { success: true }
      })
      setTimeout(hide, 5000)
      values.setLoadingExport && values.setLoadingExport(false)
    } catch (err: any) {
      console.log(err)
      show({
        message: err.message,
        type: { critical: true }
      })
      setTimeout(hide, 5000)
      values.setLoadingExport && values.setLoadingExport(false)
    }
  }

  return {
    handleExportToWord
  }
}
