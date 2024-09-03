import { programDataStoreType } from "../../schema/dataStoreSchema";

const postTrackerBody = (formData: Record<string, any>, program: programDataStoreType, trackedEntityType: string | undefined, orgUnit: string, type?: string) => {
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
                    ...(type == 'cicles' ? {
                        
                    }
                        : null
                    )
                }
            ],
            orgUnit: orgUnit,
            program: program?.program,
            trackedEntityType: trackedEntityType
        }]
    };
}

export { postTrackerBody }