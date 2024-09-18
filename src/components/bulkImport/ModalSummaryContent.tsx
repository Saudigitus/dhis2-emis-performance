import React, { useEffect, useState } from "react";
import { Divider, IconCheckmarkCircle16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import styles from "./modal.module.css";
import Title from "../text/Title";
import SummaryCards from "./SummaryCards";
import { Collapse, LinearProgress } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import {
    type BulkImportResponseStats,
    BulkImportResponseStatsState,
    type ProcessingRecords,
    ProcessingRecordsState,
    ProcessingStage
} from "../../schema/bulkImportSchema";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { type ApiResponse } from "../../types/bulkImport/Interfaces";
import { usePostEvent } from "../../hooks";
import { type ButtonActionProps } from "../../types/Buttons/ButtonActions";
import { ProgressState } from "../../schema/linearProgress";

interface ModalContentProps {
    setOpen: (value: boolean) => void
    summaryData: any
    summaryDetails?: React.ReactElement
}

const ModalSummaryContent = (props: ModalContentProps): React.ReactElement => {
    const {
        setOpen,
        summaryData,
        summaryDetails
    } = props;

    const [showDetails, setShowDetails] = useState(false)
    const processedRecords: ProcessingRecords = useRecoilValue<ProcessingRecords>(ProcessingRecordsState)
    const [processingStage, setProcessingStage] = useRecoilState<string>(ProcessingStage)
    const [bulkImportResponseStatsState, setBulkImportResponseStatsState] = useRecoilState<BulkImportResponseStats>(BulkImportResponseStatsState)
    const resetBulkImportResponseStatsState = useResetRecoilState(BulkImportResponseStatsState)
    const {
        loadUpdateEvent: loading,
        updateEvent,
        data,
        error
    } = usePostEvent()
    const [progress, setProgress] = useRecoilState(ProgressState)

    useEffect(() => {
        if (data !== undefined) {
            const { validationReport } = data
            if (processingStage === "dry-run") {
                setBulkImportResponseStatsState({
                    ...bulkImportResponseStatsState,
                    validationReport,
                    stats: data.stats,
                    status: data.status,
                    bundleReport: data.bundleReport
                })
            } else if (processingStage === "update") {
                setBulkImportResponseStatsState({
                    ...bulkImportResponseStatsState,
                    validationReport,
                    stats: data.stats,
                    status: data.status,
                    bundleReport: data.bundleReport
                })
                setProcessingStage("completed")
            }
        }
    }, [data]);

    useEffect(() => {
        if (error !== undefined) {
            const importResponse: ApiResponse = error.details as unknown as ApiResponse
            setBulkImportResponseStatsState({
                ...bulkImportResponseStatsState,
                validationReport: importResponse.validationReport,
                stats: importResponse.stats,
                status: importResponse.status
            })
        }
    }, [error])
    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }
    const summaryTitle = processingStage === "template-processing"
        ? "Template Processing"
        : processingStage === "dry-run"
            ? "Dry Run"
            : "Update"

    const updateMarks = (importMode: "VALIDATE" | "COMMIT") => {
        resetBulkImportResponseStatsState()
        if (importMode === "VALIDATE") {
            setProcessingStage("dry-run")
        } else {
            setProcessingStage("update")
            setProgress({ progress: 26, buffer: 46, stage: '' })
        }

        const params = {
            async: false,
            importMode,
            importStrategy: "CREATE_AND_UPDATE"
        }
        try {
            const EventsPayload: any = {
                events: processedRecords?.updateEvents
            }

            void updateEvent({
                data: EventsPayload,
                params
            }).then(() => setProgress({ progress: 100, buffer: 100, stage: '' }))
                .catch(() => setProgress({ progress: null }))
                
        } catch (error: any) {
            console.error("Error updating marks: ", error)
        }
    }

    // const newImportDisabled = (processedRecords.newTrackedEntities?.length === 0 || processingStage === 'completed' || loading)
    const updatesDisabled = (processedRecords.updateEvents?.length === 0 || processingStage === 'completed' || loading)

    const modalActions: ButtonActionProps[] = [
        {
            label: "Dry Run",
            loading: false,
            disabled: updatesDisabled,
            onClick: () => {
                updateMarks("VALIDATE")
            },
        },
        {
            label: "Update marks",
            primary: true,
            loading: false,
            disabled: updatesDisabled,
            onClick: () => {
                updateMarks("COMMIT")
            }
        },
        {
            label: "Close",
            disabled: loading,
            loading: false,
            onClick: () => {
                setOpen(false)
            }
        }
    ];

    return (
        <div>
            <Tag positive icon={<IconCheckmarkCircle16 />} className={styles.tagContainer}> Students import
                preview </Tag>

            <WithPadding />
            <Title label={`${summaryTitle} Summary`} />
            <WithPadding />

            <SummaryCards {...summaryData} />

            <WithPadding />
            <WithPadding />
            <ButtonStrip>
                <Button small icon={<InfoOutlined className={styles.infoIcon} />} onClick={handleShowDetails}>More
                    details</Button>
            </ButtonStrip>

            <WithPadding />
            <Collapse in={showDetails}>
                <div className={styles.detailsContainer}>
                    {summaryDetails}
                </div>
            </Collapse>

            {loading && <LinearProgress />}
            <Divider />
            <ModalActions>
                <ButtonStrip end>
                    {modalActions.map((action, i) => (
                        <Button
                            key={i}
                            {...action}
                        >
                            {action.label}
                        </Button>
                    ))}
                </ButtonStrip>
            </ModalActions>
        </div>
    );
}

export default ModalSummaryContent;
