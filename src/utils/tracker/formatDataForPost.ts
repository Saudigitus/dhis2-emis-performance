import { programDataStoreType } from "../../schema/dataStoreSchema";
import { ProgramConfig } from "../../types/programConfig/ProgramConfig";
import { programStageDataElements } from "../../types/programStageConfig/ProgramStageConfig";
import { reducer } from "../commons/formatDistinctValue";

const postTrackerBody = (formData: Record<string, any>, program: programDataStoreType, trackedEntityType: string | undefined, orgUnit: string, fieldsWithValue: programStageDataElements['dataElement'][], values: any, programStage: string) => {
    const events: any = []
    const dataValues: any = []

    for (const field of fieldsWithValue) {
        if (values[field.id]) {
            dataValues.push({
                dataElement: field.id,
                value: values[field.id]
            })
        }
    }

    return {
        trackedEntities: [{
            enrollments: [
                {
                    occurredAt: formData["registrationDate"],
                    enrolledAt: formData["registrationDate"],
                    program: program?.program,
                    orgUnit: orgUnit,
                    attributes: program?.attributes?.map((attribute: any) => {
                        if (formData[attribute.attributeName] !== undefined)
                            return { attribute: attribute.attribute, value: formData[attribute.attributeName] };
                        return null;
                    }).filter((attribute: any) => attribute != null),
                    status: "ACTIVE",
                    events: [{
                        occurredAt: formData["registrationDate"],
                        notes: [],
                        status: "ACTIVE",
                        program: program?.program,
                        programStage: programStage,
                        orgUnit,
                        scheduledAt: formData["registrationDate"],
                        dataValues: dataValues
                    }]
                }
            ],
            orgUnit: orgUnit,
            program: program?.program,
            trackedEntityType: trackedEntityType
        }]
    };
}

export { postTrackerBody }