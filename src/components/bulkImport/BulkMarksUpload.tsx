import React, { useState } from 'react';
import { Divider, IconCheckmarkCircle16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import { createStyles, createTheme, makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { DropzoneDialog } from "material-ui-dropzone";
import { CloudUpload } from "@material-ui/icons";
import { read, utils } from "xlsx";
import { CenteredContent, CircularLoader, Modal, ModalContent, ModalTitle } from "@dhis2/ui";
import styles from "./modal.module.css";
import { getMarksDataFromTemplate, generateData, createUpdatePayload } from "../../utils/bulkImport/processImportData";
import { type ProgramConfig } from "../../types/programConfig/ProgramConfig";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import useGetProgramStageTerms from "../../hooks/programStages/useGetProgramStageTerms";
import {
    type BulkImportStats,
    BulkImportStatsState,
    type ProcessingRecords,
    ProcessingRecordsState,
    ProcessingStage
} from "../../schema/bulkImportSchema";
import SummaryDetails from "./SummaryDetails";
import ModalSummaryContent from "./ModalSummaryContent";
import IteractiveProgress from '../modal/components/importProgress';
import { ProgressState } from '../../schema/linearProgress';
// import SummaryDetails from "./SummaryDetails";
// import {fromPairs} from "../../utils/bulkImport/validateTemplae";

interface BulkMarksUploadProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
    forUpdate: boolean
}

export const BulkMarksUpload = ({ setOpen, isOpen, forUpdate }: BulkMarksUploadProps) => {
    const programConfig: ProgramConfig = useRecoilValue<ProgramConfig>(ProgramConfigState)
    const [isProcessing, setIsProcessing] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const performanceStages = useGetProgramStageTerms()
    const [processingStage, resetProcessingStage] = useRecoilState<string>(ProcessingStage)
    const [uploadStats, setUploadStats] = useRecoilState<BulkImportStats>(BulkImportStatsState);
    const [_processedRecords, setProcessedRecords] = useRecoilState<ProcessingRecords>(ProcessingRecordsState);
    const marksStages = performanceStages?.items.map((p: any) => {
        return p.id
    })

    const useStyles = makeStyles(() => createStyles({
        previewChip: {
            minWidth: 160,
            maxWidth: 210
        }
    }));
    const theme = createTheme({
        overrides: {}
    });
    const classes = useStyles();
    const progress = useRecoilValue(ProgressState)

    const handleFileChange = (file: File) => {
        resetProcessingStage('template-processing')
        setIsProcessing(true)
        setSummaryOpen(true)
        const reader: FileReader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            const data: Uint8Array = new Uint8Array(e.target?.result as any);
            const workbook = read(data, {
                type: 'array',
                cellDates: true,
                cellNF: false,
                dateNF: "YYYY-MM-DD",
                cellText: true
            });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rawData = utils.sheet_to_json(worksheet,
                { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" });
            const headers: string[] = rawData[2] as string[] // hidden header in template
            // const templateHeadings = fromPairs(headers.map((val, idx) => { return [val, headings[idx] ?? ""] }))
            // setExcelTemplateHeaders(templateHeadings)
            // console.log("templateHeadings", templateHeadings)
            //
            const dataWithHeaders: Array<Record<string, any>> = generateData(headers, rawData.slice(3))
            // console.log("dataWithHeaders", dataWithHeaders)
            const marksData = getMarksDataFromTemplate(dataWithHeaders, marksStages, programConfig)
            // console.log("marksData", marksData)
            const events = createUpdatePayload(marksData)

            setUploadStats(stats => ({
                ...stats,
                events: {
                    ...stats.events,
                    // invalid: invalidRecords.length,
                    updated: events.length,
                    conflicts: 0
                }
            }))

            setProcessedRecords((r) => ({
                ...r,
                recordsToUpdate: marksData,
                updateEvents: events
            }))

            setIsProcessing(false)
        };
        reader.readAsArrayBuffer(file);
    }

    const onSave = (files: File[]) => {
        handleFileChange(files[0])
    }
    return (
        <>
            {(!isProcessing && !summaryOpen) &&
                <MuiThemeProvider theme={theme}>
                    <DropzoneDialog
                        dialogTitle={"Bulk Marks Upload"}
                        submitButtonText={"Start Import"}
                        dropzoneText={"Drag and drop a file here or Browse"}
                        Icon={CloudUpload as any}
                        filesLimit={1}
                        showPreviews={false}
                        showPreviewsInDropzone={true}
                        previewGridProps={{
                            container: {
                                spacing: 1,
                                direction: 'row'
                            }
                        }}
                        previewChipProps={{ classes: { root: classes.previewChip } }}
                        previewText="Selected file:"
                        showFileNames={true}
                        showFileNamesInPreview={true}
                        acceptedFiles={[".xlsx"]}
                        open={isOpen}
                        onClose={() => {
                            setOpen(false)
                        }}
                        onSave={onSave}
                        clearOnUnmount={true}
                    />
                </MuiThemeProvider>
            }
            {(summaryOpen) &&
                <Modal large position={"middle"} className={styles.modalContainer}>
                    {progress.progress === null && <ModalTitle>{isProcessing ? "Processing Bulk Marks Upload" : "Bulk Marks Upload Summary"}</ModalTitle>}
                    <ModalContent>
                        {progress.progress != null && processingStage !== "template-processing" && processingStage !== 'dry-run' ?
                            <>
                                < IteractiveProgress />
                                <ModalActions>
                                    <ButtonStrip end>
                                        <Button
                                            onClick={() => setOpen(false)}
                                        >
                                            Hide
                                        </Button>
                                    </ButtonStrip>
                                </ModalActions>
                            </>
                            : <ModalSummaryContent
                                setOpen={setSummaryOpen}
                                summaryData={
                                    {
                                        updated: uploadStats.events.updated,
                                        created: uploadStats.events.created,
                                        conflicts: uploadStats.events.conflicts,
                                        duplicates: uploadStats.events.updated,
                                        invalid: uploadStats.events.invalid
                                    }
                                }
                                summaryDetails={
                                    <>
                                        <SummaryDetails />
                                    </>
                                }
                            />
                        }
                    </ModalContent>

                </Modal>}
        </>
    );
}
