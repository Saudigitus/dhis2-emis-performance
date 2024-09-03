import { programDataStoreType } from "../../schema/dataStoreSchema";
import { reducer } from "../commons/formatDistinctValue";

const postTrackerBody = (formData: Record<string, any>, program: programDataStoreType, trackedEntityType: string | undefined, orgUnit: string, fieldsWithValue: any[]) => {
    const events : any = []

    for (const field of fieldsWithValue) {
        for (const [key, value] of Object.entries(reducer(field))) {
            events.push({
                occurredAt: formData["registrationDate"],
                notes: [],
                status: "ACTIVE",
                program: program?.program,
                programStage: key,
                orgUnit,
                scheduledAt: formData["registrationDate"],
                dataValues: value
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
                    events: events
                }
            ],
            orgUnit: orgUnit,
            program: program?.program,
            trackedEntityType: trackedEntityType
        }]
    };
}

export { postTrackerBody }