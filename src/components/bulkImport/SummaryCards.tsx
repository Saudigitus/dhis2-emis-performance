import React from "react";
import { ButtonStrip } from "@dhis2/ui";
import SummaryCard from "../card/SummaryCard";
import {useRecoilValue} from "recoil";
import {
    type BulkImportResponseStats,
    BulkImportResponseStatsState,
    ProcessingStage
} from "../../schema/bulkImportSchema";

interface SummaryCardsProps {
    created: number
    updated: number
    conflicts: number
    duplicates: number
    invalid: number
}

function SummaryCards(values: SummaryCardsProps): React.ReactElement {
    const { updated } = values;
    const processingStage: string = useRecoilValue<string>(ProcessingStage)
    // const processedRecords: ProcessingRecords = useRecoilValue<ProcessingRecords>(ProcessingRecordsState)
    const bulkImportResponseStats: BulkImportResponseStats = useRecoilValue<BulkImportResponseStats>(BulkImportResponseStatsState)
    return processingStage === "template-processing"
        ? (
            <ButtonStrip>
                <SummaryCard color="secondary" label={"Updates"} value={updated.toString()} />
            </ButtonStrip>)
        : (
            <ButtonStrip>
                <SummaryCard color="success" label="Imported" value={bulkImportResponseStats.stats.created.toString()} />
                <SummaryCard color="secondary" label="Updated" value={bulkImportResponseStats.stats.updated.toString()} />
                <SummaryCard color="error" label="Ignored" value={bulkImportResponseStats.stats.ignored.toString()} />
                <SummaryCard color="secondary" label="Conflicts" value={bulkImportResponseStats.validationReport.errorReports.length.toString()} />
            </ButtonStrip>
        )
}

export default SummaryCards;
