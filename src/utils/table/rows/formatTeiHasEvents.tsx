import { nextProgramStageType } from "../../../types/dataStore/DataStoreConfig";

function teiHasEvents(nextAction: nextProgramStageType[], events: any[], allteis: string[]) {
    
    return allteis?.map((trackedEntity) => {
        const result: { trackedEntity: string, [key: string]: any } = { trackedEntity };

        nextAction?.forEach((item) => {
            result[item.programStage] = events?.find((event: { trackedEntity: string, programStage: string }) => 
                event.trackedEntity == trackedEntity && event.programStage == item.programStage
            ) ? true : false;
        });

        return result;
    });
}

export  { teiHasEvents }